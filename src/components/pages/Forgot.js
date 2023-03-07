/**
 * Forgot
 *
 * Forgot page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-17
 */
// Ouroboros modules
import brain, { errors } from '@ouroboros/brain';
// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
/**
 * Forgot
 *
 * Handles forgotten password / reset dialog
 *
 * @name Forgot
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Forgot(props) {
    // State
    const [confirm, confirmSet] = useState('');
    const [errorMsg, errorMsgSet] = useState(false);
    const [passwd, passwdSet] = useState('');
    // Trap enter clicks to trigger sign in
    function keyPressed(event) {
        if (event.key === 'Enter') {
            submit();
        }
    }
    // Called to change password
    function submit() {
        // Reset error message
        errorMsgSet(false);
        // If the passwords do not match
        if (confirm !== passwd) {
            errorMsgSet('Passwords do not match');
            return;
        }
        // Make the request to the server
        brain.update('user/passwd/forgot', {
            key: props.forgotKey,
            passwd
        }).then((data) => {
            if (data) {
                if (props.onSuccess) {
                    props.onSuccess();
                }
            }
        }, (error) => {
            if (error.code === errors.body.DB_NO_RECORD) {
                errorMsgSet('Invalid Key');
            }
            else if (error.code === errors.PASSWORD_STRENGTH) {
                errorMsgSet('New password is not strong enough. Must contain at least 1 uppercase letter, at least 1 lowercase letter, and at least 1 number.');
            }
            else {
                errorMsgSet(JSON.stringify(error, null, 4));
            }
        });
    }
    // Render
    return (React.createElement(Dialog, { "aria-labelledby": "forgot-dialog-title", fullWidth: true, id: "forgot", maxWidth: "sm", open: true },
        React.createElement(DialogTitle, { id: "signin-dialog-title" }, "Please change your password"),
        React.createElement(DialogContent, { dividers: true },
            errorMsg &&
                React.createElement("div", { className: "error" }, errorMsg),
            React.createElement("br", null),
            React.createElement(Box, { className: "field" },
                React.createElement(TextField, { label: "Password", onChange: ev => passwdSet(ev.target.value), onKeyPress: keyPressed, placeholder: "Password", type: "password", value: passwd })),
            React.createElement(Box, { className: "field" },
                React.createElement(TextField, { label: "Confirm Password", onChange: ev => confirmSet(ev.target.value), onKeyPress: keyPressed, placeholder: "Confirm Password", type: "password", value: confirm }))),
        React.createElement(DialogActions, { className: "flexColumns" },
            React.createElement(Button, { disabled: passwd.trim() === '' || confirm.trim() === '', onClick: submit, variant: "contained" }, "Change Password"))));
}
// Valid props
Forgot.propTypes = {
    mobile: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func,
    forgotKey: PropTypes.string.isRequired
};
