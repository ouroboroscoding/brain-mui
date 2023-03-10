/**
 * Myself
 *
 * Handles managing the currently signed in user and their permissions
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-03-06
 */
// Ouroboros modules
import body from '@ouroboros/body';
import brain from '@ouroboros/brain';
import clone from '@ouroboros/clone';
// NPM modules
import { useEffect, useState } from 'react';
// Rights types
const _types = {
    create: 0x01,
    read: 0x02,
    update: 0x04,
    delete: 0x08
};
// Module values
//	Users
let _user = false;
const _userSubscriptions = [];
// Permissions
let _permissions = {};
const _permissionsSubscriptions = [];
// Rights
const _rightsSubscriptions = {};
// Trap no session errors
body.onNoSession(() => {
    brain.session(null);
    set(false);
    permissionsSet({});
});
/**
 * Permissions Subscribe
 *
 * Subscribes a callback to all permissions or a specific one
 *
 * @name permissionsSubscribe
 * @access public
 * @param callback The callback to subscribe
 * @param permission Optional, the specific permission to subscribe to
 */
export function permissionsSubscribe(callback, permission) {
    // If we have no specific permission
    if (permission === undefined) {
        // Just add it to the list
        _permissionsSubscriptions.push(callback);
        // Clone the current permissions
        const oPermissions = clone(_permissions);
        // Call the callback with the current data
        callback(oPermissions);
        // Return the current data and an unsubscribe function
        return {
            data: oPermissions,
            unsubscribe: () => {
                permissionsUnsubscribe(callback);
            }
        };
    }
    // Else, we have a specific permission
    else {
        // If we don't have this permission yet
        if (!(permission in _rightsSubscriptions)) {
            _rightsSubscriptions[permission] = [];
        }
        // Add the callback
        _rightsSubscriptions[permission].push(callback);
        // Get the rights
        const oRights = permission in _permissions ? clone(_permissions[permission]) : {};
        // Call the callback with the current data
        callback(oRights);
        // Return the current data and an unsubscribe function
        return {
            data: oRights,
            unsubscribe: () => {
                permissionsUnsubscribe(callback, permission);
            }
        };
    }
}
/**
 * Permissions Unsubscribe
 *
 * Unsubscribes a callback from all permissions or a specific one
 *
 * @name permissionsUnsubscribe
 * @access public
 * @param callback The callback to unsubscribe
 * @param permission Optional, the specific permission to unsubscribe from
 * @returns true if the callback was found and removed
 */
export function permissionsUnsubscribe(callback, permission) {
    // If we have no specific permission
    if (permission === undefined) {
        // Find the callback
        const i = _permissionsSubscriptions.indexOf(callback);
        // If we found it
        if (i > -1) {
            // Splice it out and return that we did so
            _permissionsSubscriptions.splice(i, 1);
            return true;
        }
        // Not found
        return false;
    }
    // Else, we have a specific permission
    else {
        // If we don't have any callbacks for the permission
        if (!(permission in _rightsSubscriptions)) {
            return false;
        }
        // Find the callback
        const i = _rightsSubscriptions[permission].indexOf(callback);
        // If we found it
        if (i > -1) {
            // Splice it out
            _rightsSubscriptions[permission].splice(i, 1);
            // If we no longer have any callbacks, remove the permission
            if (_rightsSubscriptions[permission].length <= 0) {
                delete _rightsSubscriptions[permission];
            }
            // Return found and remove
            return true;
        }
        // Not found
        return false;
    }
}
/**
 * Permissions Set
 *
 * Sets the new permissions
 *
 * @name permissionsSet
 * @access public
 * @param permissions The new list of permissions from the user
 */
function permissionsSet(list) {
    // Reset the point to the list by re-initialising it
    _permissions = {};
    // Go through each permission
    for (const name of Object.keys(list)) {
        // Initialise the permission rights to none
        _permissions[name] = {};
        // Go through each right
        for (const s of Object.keys(_types)) {
            // If it exists on the permission
            if (list[name] & _types[s]) {
                // Set it to true
                _permissions[name][s] = true;
            }
        }
    }
    // Go through all callbacks for all permissions
    for (const f of _permissionsSubscriptions) {
        // Pass a copy of all permissions to it
        f(clone(_permissions));
    }
    // Go through all names of permissions in the rights callbacks
    for (const p of Object.keys(_rightsSubscriptions)) {
        // Go through each callback
        for (const f of _rightsSubscriptions[p]) {
            // Pass a copy of the rights to it if we find any, else just an
            //	empty object
            f((p in _permissions ? clone(_permissions[p]) : {}));
        }
    }
}
/**
 * Set
 *
 * Sets the new user and fires off notifications to all subscriptions
 *
 * @name set
 * @access private
 * @param user The user data or false
 */
function set(user) {
    // Set the new user
    _user = user;
    // Go through all subscriptions
    for (const f of _userSubscriptions) {
        f(clone(_user));
    }
}
/**
 * Sign In
 *
 * Called to sign into a user account
 *
 * @name signin
 * @access public
 * @param using A session token, or the email/passwd to log in
 */
export function signin(using) {
    // Create a new Promise and return it
    return new Promise((resolve, reject) => {
        // If we got session token
        if (typeof using === 'string') {
            // Set the session
            brain.session(using);
            // Fetch the user associated
            update().then(user => {
                resolve({
                    session: using,
                    user
                });
            });
        }
        // Else, if we got an email and password
        else {
            // Attempt to signin
            brain.create('signin', using).then((data) => {
                // If we were successful
                if (data) {
                    // Set the session
                    brain.session(data.session);
                    // Fetch the current user
                    update().then(user => {
                        // Resolve with the session and user
                        resolve({
                            session: data.session,
                            user
                        });
                    });
                }
            }, reject);
        }
    });
}
/**
 * Sign Out
 *
 * Called to sign out the current user
 *
 * @name signout
 * @access public
 */
export function signout() {
    // Create a new Promise and return it
    return new Promise((resolve, reject) => {
        // Call the sign out request
        brain.create('signout').then((data) => {
            if (data) {
                brain.session(null);
                set(false);
                permissionsSet({});
            }
            resolve(data);
        }, reject);
    });
}
/**
 * Subscribe
 *
 * Subscribes a callback to signed in user updates
 *
 * @name subscribe
 * @access public
 * @param callback The callback to subscribe
 */
export function subscribe(callback) {
    // Add it to the list
    _userSubscriptions.push(callback);
    // Clone the user
    const oUser = clone(_user);
    // Call the callback with the current data
    callback(oUser);
    // Return the current data and an unsubscribe function
    return {
        data: oUser,
        unsubscribe: () => {
            unsubscribe(callback);
        }
    };
}
/**
 * Unsubscribe
 *
 * Unsubscribes a callback from getting signed in user updates
 *
 * @name unsubscribe
 * @access public
 * @param callback The callback to unsubscribe
 * @param permission Optional, the specific permission to unsubscribe from
 * @returns true if the callback was found and removed
 */
export function unsubscribe(callback) {
    // Find the callback
    const i = _userSubscriptions.indexOf(callback);
    // If we found it
    if (i > -1) {
        // Splice it out and return that we did so
        _userSubscriptions.splice(i, 1);
        return true;
    }
    // Not found
    return false;
}
/**
 * Update
 *
 * Sets the passed data, or gets the latest from the server
 *
 * @name update
 * @access public
 * @param user Optional, the user data to set from
 */
export function update() {
    // Create a new Promise and return it
    return new Promise((resolve, reject) => {
        // Fetch the user using the session
        brain.read('user').then((data) => {
            // If we got the user
            if (data) {
                // Set the current user
                set(data);
                // Update the permissions
                permissionsSet(data.permissions);
                // Resolve with the user data
                resolve(data);
            }
        }, (error) => {
            if (error.handle) {
                error.handle(JSON.stringify({ code: error.code, msg: error.msg }));
            }
            else {
                reject(error);
            }
        });
    });
}
/**
 * Use Permissions
 *
 * A react hook to keep track of what rights a user has
 *
 * @name usePermissions
 * @access public
 * @returns the rights associated with all permissions
 */
export function usePermissions() {
    // Store the state
    const [perms, permsSet] = useState({});
    // Load effect, subscribe to permissions changes
    useEffect(() => {
        const o = permissionsSubscribe(permsSet);
        return () => o.unsubscribe();
    }, []);
    // Return the current value
    return perms;
}
/**
 * Use Rights
 *
 * A react hook to keep track of what rights a user has
 *
 * @name useRights
 * @access public
 * @param permission The name of the permission to track
 * @returns the rights associated with the permission
 */
export function useRights(permission) {
    // Store the state
    const [rights, rightsSet] = useState({});
    // Load effect, subscribe to specific permission changes
    useEffect(() => {
        const o = permissionsSubscribe(rightsSet, permission);
        return () => o.unsubscribe();
    }, []);
    // Return the current value
    return rights;
}
/**
 * Use User
 *
 * A hook to get the currently logged in user
 *
 * @name useUser
 * @access public
 * @returns the currently logged in user
 */
export function useUser() {
    // State
    const [user, userSet] = useState(false);
    // Load effect, subscribe to user changes
    useEffect(() => {
        const o = subscribe(userSet);
        return () => o.unsubscribe();
    }, []);
    // Return current user
    return user;
}
