/**
 * Account
 *
 * Handles signed in user's data
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-17
 */
// Ouroboros modules
import { errors as bodyErrors } from '@ouroboros/body';
import brain, { errors } from '@ouroboros/brain';
import UserDef from '@ouroboros/brain/definitions/user.json';
import { Tree } from '@ouroboros/define';
import { Form } from '@ouroboros/define-mui';
// NPM modules
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
// Material UI
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// Local modules
import { useUser, update } from '../../Myself';
// Generate the E-Mail change tree Trees
const EmailTree = new Tree({
    __name__: 'PSUEDO_Brain_Email',
    email: {
        __type__: 'string',
        __ui__: { 'title': 'New E-Mail', 'type': 'text' }
    },
    email_passwd: {
        __type__: 'string',
        __maximum__: 255,
        __ui__: { 'title': 'Your Password', 'type': 'password' }
    }
});
// Generate the Password change Tree
const PassTree = new Tree({
    __name__: 'PSUEDO_Brain_Passwd_Change',
    passwd: {
        __type__: 'string',
        __ui__: { title: 'Current Password', type: 'password' }
    },
    new_passwd: {
        __type__: 'string',
        __maximum__: 255,
        __ui__: { regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
            title: 'New Password', type: 'password' }
    },
    confirm_passwd: {
        __type__: 'string',
        __maximum__: 255,
        __ui__: { regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
            title: 'Confirm Password', type: 'password' }
    }
});
// Generate the User details Tree
const UserTree = new Tree(UserDef, {
    __ui__: {
        update: ['title', 'first_name', 'last_name', 'suffix', 'phone_number', 'phone_ext']
    }
});
/**
 * Account
 *
 * Shows dialog for user to edit their account data
 *
 * @name Account
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Account(props) {
    // Refs
    const emailForm = useRef(null);
    const passForm = useRef(null);
    // Hooks
    const user = useUser();
    // Called when the email form is submitted
    function emailSubmit(self) {
        // Create a new Promise and return it
        return new Promise((resolve, reject) => {
            // Add the URL to self
            self.url = props.verificationUrl;
            // Send the data to the server
            brain.update('user/email', self).then((data) => {
                // If we were successful
                if (data) {
                    // Fetch the latest user data
                    update();
                    // If we have an onEmailChanged prop
                    if (props.onEmailChanged) {
                        props.onEmailChanged(self.email);
                    }
                    // Reset the form
                    if (emailForm.current) {
                        emailForm.current.reset();
                    }
                }
                // Resolve
                resolve(data);
            }, (error) => {
                // If we got field errors
                if (error.code === bodyErrors.DATA_FIELDS) {
                    reject(error.msg);
                }
                // Else, if the email is a duplicate of an existing account
                else if (error.code === bodyErrors.DB_DUPLICATE) {
                    reject([['email', 'Already in use']]);
                }
                // Else, if the password passed is invalid for the current
                //	account
                else if (error.code === errors.SIGNIN_FAILED) {
                    reject([['email_passwd', 'Invalid Password']]);
                }
                // Else, unknown error
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
    // Called when the password change form is submitted
    function passwordSubmit(self) {
        // Create a new Promise and return it
        return new Promise((resolve, reject) => {
            // If the passwords don't match
            if (self.new_passwd !== self.confirm_passwd) {
                return reject(['confirm_passwd', 'Passwords don\'t match']);
            }
            // Remove the confirm
            delete self.confirm_passwd;
            // Submit the new password
            brain.update('user/passwd', self).then((data) => {
                // If we were successful
                if (data) {
                    // If we have an onPasswdChanged prop
                    if (props.onPasswdChanged) {
                        props.onPasswdChanged();
                    }
                    // Reset the form
                    if (passForm.current) {
                        passForm.current.reset();
                    }
                }
                // Resolve
                resolve(data);
            }, (error) => {
                // If we got field errors
                if (error.code === bodyErrors.DATA_FIELDS) {
                    reject(error.msg);
                }
                // Else, if the new password isn't strong enough
                else if (error.code === errors.PASSWORD_STRENGTH) {
                    reject([['new_passwd', 'Not strong enough']]);
                }
                // Else, unknown error
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
    // Called when the user form is submitted
    function userSubmit(self, key) {
        // Create a new Promise and return it
        return new Promise((resolve, reject) => {
            // Send the data to the server
            brain.update('user', self).then((data) => {
                // If we were successful
                if (data) {
                    // If we have an onDetailsChanged prop
                    if (props.onDetailsChanged) {
                        props.onDetailsChanged(self);
                    }
                    // Fetch the latest user data
                    update();
                }
            }, (error) => {
                // If we got field errors
                if (error.code === bodyErrors.DATA_FIELDS) {
                    reject(error.msg);
                }
                // Else, unknown error
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
    // Wait until we get the user
    if (!user) {
        return null;
    }
    // Render
    return (React.createElement(Dialog, { maxWidth: "lg", onClose: props.onClose, open: true, "aria-labelledby": "account-dialog-title" },
        React.createElement(DialogTitle, { id: "account-dialog-title" }, "Account Details"),
        React.createElement(DialogContent, { dividers: true },
            React.createElement("h2", null, "Update E-mail Address"),
            React.createElement(Typography, { style: { marginBottom: '10px' } }, user && user.email),
            React.createElement(Form, { onSubmit: emailSubmit, ref: emailForm, tree: EmailTree, type: "update" }),
            React.createElement(Divider, null),
            React.createElement("br", null),
            React.createElement("h2", null, "Update User Details"),
            React.createElement(Form, { gridSizes: {
                    title: { xs: 12, sm: 3, lg: 2 },
                    first_name: { xs: 12, sm: 9, lg: 4 },
                    last_name: { xs: 12, sm: 9, lg: 4 },
                    suffix: { xs: 12, sm: 3, lg: 2 },
                    phone_number: { xs: 12, sm: 8 },
                    phone_ext: { xs: 12, sm: 4 }
                }, onSubmit: userSubmit, tree: UserTree, type: "update", value: user }),
            React.createElement(Divider, null),
            React.createElement("br", null),
            React.createElement("h2", null, "Update Password"),
            React.createElement(Form, { gridSizes: {
                    passwd: { xs: 12 },
                    new_passwd: { xs: 12, md: 6 },
                    confirm_passwd: { xs: 12, md: 6 }
                }, onSubmit: passwordSubmit, ref: passForm, tree: PassTree, type: "update" }))));
}
// Valid props
Account.propTypes = {
    onClose: PropTypes.func.isRequired,
    onDetailsChanged: PropTypes.func,
    onEmailChanged: PropTypes.func,
    onError: PropTypes.func,
    onPasswdChanged: PropTypes.func,
    verificationUrl: PropTypes.string.isRequired
};
