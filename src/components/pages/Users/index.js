/**
 * Users
 *
 * Users page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-18
 */
// Ouroboros modules
import brain, { errors } from '@ouroboros/brain';
import UserDef from '@ouroboros/brain/definitions/user.json';
import clone from '@ouroboros/clone';
import { Tree } from '@ouroboros/define';
import { Form, Results, Search } from '@ouroboros/define-mui';
import { afindi, merge } from '@ouroboros/tools';
// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
// Composites
import Permissions from './Permissions';
// Local modules
import { useRights } from '../../../Myself';
// Generate the user Tree
const UserTree = new Tree(UserDef, {
    __ui__: {
        create: ['email', 'title', 'first_name', 'last_name', 'suffix', 'phone_number', 'phone_ext'],
        results: ['_id', 'email', 'title', 'first_name', 'last_name', 'suffix'],
        search: ['_id', 'email', 'first_name', 'last_name', 'phone_number'],
        update: ['title', 'first_name', 'last_name', 'suffix', 'phone_number', 'phone_ext']
    },
    title: { __ui__: { title: 'Dr. Mrs. Miss...' } },
    suffix: { __ui__: { title: 'PhD, RN, Esq...' } }
});
// Constants
const GRID_SIZES = {
    __default__: { xs: 12 },
    title: { xs: 12, sm: 3, lg: 2 },
    first_name: { xs: 12, sm: 9, lg: 4 },
    last_name: { xs: 12, sm: 9, lg: 4 },
    suffix: { xs: 12, sm: 3, lg: 2 },
    phone_number: { xs: 12, sm: 8 },
    phone_ext: { xs: 12, sm: 4 }
};
/**
 * Users
 *
 * Handles user (login) management
 *
 * @name Users
 * @access public
 * @param props Properties passed to the component
 * @returns React.Component
 */
export default function Users(props) {
    // State
    const [createForm, createFormSet] = useState(false);
    const [password, passwordSet] = useState(false);
    const [records, recordsSet] = useState([]);
    // Hooks
    const rightsPermission = useRights('brain_permission');
    const rightsUser = useRights('brain_user');
    // Refs
    const refPasswd = useRef(null);
    const refSearch = useRef(null);
    // User permissions change effect
    useEffect(() => {
        // If we have a read right
        if (rightsUser.read) {
            if (refSearch.current) {
                refSearch.current.query();
            }
        }
        else {
            recordsSet([]);
        }
        // If we don't have create access
        if (!rightsUser.create) {
            createFormSet(false);
        }
        // If we can't update
        if (!rightsUser.update) {
            passwordSet(false);
        }
    }, [rightsUser]);
    // Called when the create form is submitted
    function create(user) {
        // Add the url to the user data
        user.url = 'https://' + window.location.host + '/setup/{key}';
        // Create a new Promise and return it
        return new Promise((resolve, reject) => {
            // Make the request to the server
            brain.create('user', user).then((data) => {
                // If we were successful
                if (data) {
                    // If we have an onSuccess prop
                    if (props.onSuccess) {
                        props.onSuccess('create', user);
                    }
                    // Add the ID to the user
                    user._id = data;
                    // Hide the form, overwrite the results, and clear the
                    //	search
                    createFormSet(false);
                    recordsSet([user]);
                    if (refSearch.current) {
                        refSearch.current.reset();
                    }
                }
                // Resolve
                resolve(true);
            }, (error) => {
                if (error.code === errors.body.DATA_FIELDS) {
                    reject(error.msg);
                }
                else if (error.code === errors.body.DB_DUPLICATE) {
                    reject({ email: 'Already in use' });
                }
                else {
                    if (props.onError) {
                        props.onError(error);
                    }
                    else {
                        throw new Error(JSON.stringify(error));
                    }
                }
            });
        });
    }
    // Called to update the user's password
    function passwordUpdate() {
        // If we don't have a new password
        if (!refPasswd.current) {
            return;
        }
        // Update the agent's password
        brain.update('user/passwd', {
            _id: password,
            new_passwd: refPasswd.current.value
        }).then((data) => {
            if (data) {
                if (props.onSuccess) {
                    props.onSuccess('password');
                }
                passwordSet(false);
            }
        });
    }
    // Called when search is submitted
    function search(filter) {
        // Create a new Promise and return it
        return new Promise((resolve, reject) => {
            // Fetch the records from the server
            brain.read('search', { filter }).then((data) => {
                // Set the new records
                recordsSet(data);
                // Resolve
                resolve(true);
            }, (error) => {
                if (error.code === errors.body.DATA_FIELDS) {
                    reject(error.msg);
                }
                else {
                    if (props.onError) {
                        props.onError(error);
                    }
                }
            });
        });
    }
    // Called when update form is submitted
    function update(user, key) {
        // Add the key to the user
        user._id = key;
        // Create a new Promise and return it
        return new Promise((resolve, reject) => {
            // Send the request to the server
            brain.update('user', user).then((data) => {
                // If we got success
                if (data) {
                    // If we have an onSuccess prop
                    if (props.onSuccess) {
                        props.onSuccess('update', user);
                    }
                    // Look for the record
                    const i = afindi(records, '_id', user._id);
                    // If it exists
                    if (i > -1) {
                        // Clone the records, update the index, and set the new records
                        const lUsers = clone(records);
                        merge(lUsers[i], user);
                        recordsSet(lUsers);
                    }
                }
                // Resolve
                resolve(data);
            }, (error) => {
                if (error.code === errors.body.DATA_FIELDS) {
                    reject(error.msg);
                }
                else {
                    if (props.onError) {
                        props.onError(error);
                    }
                    else {
                        throw new Error(JSON.stringify(error));
                    }
                }
            });
        });
    }
    // Init the actions
    const lActions = [];
    // If the user can change permissions
    if (rightsPermission.update) {
        lActions.push({
            tooltip: "Edit User's permissions",
            icon: 'fa-solid fa-list',
            component: Permissions,
            props: {
                sections: props.allowedPermissions,
                onUpdate: () => {
                    if (props.onSuccess) {
                        props.onSuccess('permissions');
                    }
                }
            }
        });
    }
    // If the user can update other users
    if (rightsUser.update) {
        lActions.push({ tooltip: "Change User's password", icon: 'fa-solid fa-unlock-keyhole', callback: user => passwordSet(user._id) });
    }
    // Render
    return (React.createElement(Box, { id: "users", className: "flexGrow padding" },
        React.createElement(Box, { className: "flexColumns" },
            React.createElement("h1", { className: "flexGrow" }, "Users"),
            rightsUser.create &&
                React.createElement(Box, { className: "flexStatic" },
                    React.createElement(Tooltip, { title: "Create new User", className: "page_action", onClick: () => createFormSet(val => !val) },
                        React.createElement(IconButton, null,
                            React.createElement("i", { className: 'fa-solid fa-user-plus' + (createForm ? ' open' : '') }))))),
        rightsUser.create && createForm &&
            React.createElement(Paper, { className: "padding" },
                React.createElement(Form, { gridSizes: GRID_SIZES, onCancel: () => createFormSet(false), onSubmit: create, tree: UserTree, type: "create" })),
        React.createElement(Search, { hash: "users", name: "users", onSearch: search, ref: refSearch, tree: UserTree }),
        React.createElement(Results, { actions: lActions, data: records, gridSizes: GRID_SIZES, onUpdate: rightsUser.update ? update : false, orderBy: "email", tree: UserTree }),
        password &&
            React.createElement(Dialog, { "aria-labelledby": "password-dialog-title", maxWidth: "lg", onClose: ev => passwordSet(false), open: true },
                React.createElement(DialogTitle, { id: "password-dialog-title" }, "Update Password"),
                React.createElement(DialogContent, { dividers: true },
                    React.createElement(TextField, { label: "New Password", inputRef: refPasswd })),
                React.createElement(DialogActions, null,
                    React.createElement(Button, { variant: "contained", color: "secondary", onClick: ev => passwordSet(false) }, "Cancel"),
                    React.createElement(Button, { variant: "contained", color: "primary", onClick: passwordUpdate }, "Update")))));
}
// Valid props
Users.propTypes = {
    allowedPermissions: PropTypes.arrayOf(PropTypes.exact({
        title: PropTypes.string.isRequired,
        rights: PropTypes.arrayOf(PropTypes.exact({
            name: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            allowed: PropTypes.number.isRequired
        }))
    })).isRequired,
    onError: PropTypes.func,
    onSuccess: PropTypes.func
};
