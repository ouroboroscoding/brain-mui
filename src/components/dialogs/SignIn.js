/**
 * Sign In
 *
 * Handles sign in modal
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-01-17
 */
// Ouroboros modules
import { errors as bodyErrors } from '@ouroboros/body';
import brain, { errors } from '@ouroboros/brain';
import { errorTree } from '@ouroboros/define-mui';
// NPM modules
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// Local modules
import { signin, useUser } from '../../Myself';
/**
 * Sign In
 *
 * Displays the form to sign into the site
 *
 * @name SignIn
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function SignIn(props) {
    // State
    const [fieldErrors, fieldErrorsSet] = useState({});
    const [forgot, forgotSet] = useState(false);
    // Refs
    const emailRef = useRef(null);
    const passwdRef = useRef(null);
    // Hooks
    const user = useUser();
    // Called to submit a request to change forgotten password
    function forgotSubmit() {
        // If we don't have the email input
        if (emailRef.current === null) {
            return;
        }
        // Send the forgot password request
        brain.create('user/passwd/forgot', {
            email: emailRef.current.value,
            url: props.forgotUrl
        }).then((data) => {
            // If we got success
            if (data) {
                // If we have an onForgot prop
                if (props.onForgot) {
                    props.onForgot();
                }
                // Clear forgot
                forgotSet(false);
            }
        }, (error) => {
            // If we got field errors
            if (error.code === bodyErrors.DATA_FIELDS) {
                fieldErrorsSet(errorTree(error.msg));
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
    }
    // Trap enter clicks to trigger sign in
    function keyPressed(event) {
        if (event.key === 'Enter') {
            signinSubmit();
        }
    }
    // Attempt to sign in with the given credentials
    function signinSubmit() {
        // If we don't have the refs
        if (emailRef.current === null || passwdRef.current === null) {
            return;
        }
        // If either value is empty
        if (emailRef.current.value === '' ||
            passwdRef.current.value === '') {
            return;
        }
        // Call the signin
        signin({
            email: emailRef.current.value,
            passwd: passwdRef.current.value
        }).then((data) => {
            // If we have an onSuccess prop
            if (props.onSignIn) {
                props.onSignIn(data);
            }
        }, (error) => {
            // If we got field errors
            if (error.code === bodyErrors.DATA_FIELDS) {
                fieldErrorsSet(errorTree(error.msg));
            }
            // Else, if the signin itself failed
            else if (error.code === errors.SIGNIN_FAILED) {
                fieldErrorsSet({ general: 'Email or password invalid' });
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
    }
    // If we have a user
    if (user !== false) {
        return null;
    }
    // Render
    return (React.createElement(Dialog, { "aria-labelledby": "signin-dialog-title", fullWidth: true, id: "signin", maxWidth: "sm", open: true }, forgot ? (React.createElement(React.Fragment, null,
        React.createElement(DialogTitle, { id: "signin-dialog-title" }, "Please enter the email for your account"),
        React.createElement(DialogContent, { dividers: true },
            fieldErrors.general &&
                React.createElement(Box, { className: "error" }, fieldErrors.general),
            React.createElement("br", null),
            React.createElement(Box, { className: "field" },
                React.createElement(TextField, { error: fieldErrors.email ? true : false, helperText: fieldErrors.email || '', inputRef: emailRef, label: "Email", onKeyPress: keyPressed, type: "email" }))),
        React.createElement(DialogActions, { className: "flexColumns" },
            React.createElement(Box, { className: "flexGrow center" },
                React.createElement(Typography, { className: "link", onClick: () => forgotSet(false) }, "Return to Sign In")),
            React.createElement(Box, { className: "flexStatic" },
                React.createElement(Button, { variant: "contained", color: "primary", onClick: forgotSubmit }, "Request Password Reset"))))) : (React.createElement(React.Fragment, null,
        React.createElement(DialogTitle, { id: "signin-dialog-title" }, "Welcome, please sign in"),
        React.createElement(DialogContent, { dividers: true },
            fieldErrors.general &&
                React.createElement(Box, { className: "error" }, fieldErrors.general),
            React.createElement("br", null),
            React.createElement(Box, { className: "field" },
                React.createElement(TextField, { error: fieldErrors.email ? true : false, helperText: fieldErrors.email || '', inputRef: emailRef, label: "Email", onKeyPress: keyPressed, type: "email" })),
            React.createElement(Box, { className: "field" },
                React.createElement(TextField, { error: fieldErrors.passwd ? true : false, helperText: fieldErrors.passwd || '', inputRef: passwdRef, label: "Password", onKeyPress: keyPressed, type: "password" }))),
        React.createElement(DialogActions, { className: "flexColumns" },
            React.createElement(Box, { className: "flexGrow center" },
                React.createElement(Typography, { className: "link", onClick: () => forgotSet(true) }, "Forgot Password?")),
            React.createElement(Box, { className: "flexStatic" },
                React.createElement(Button, { variant: "contained", color: "primary", onClick: signinSubmit }, "Sign In")))))));
}
// Valid props
SignIn.propTypes = {
    forgotUrl: PropTypes.string.isRequired,
    onError: PropTypes.func,
    onForgot: PropTypes.func,
    onSignIn: PropTypes.func
};
