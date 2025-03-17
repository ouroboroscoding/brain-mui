/**
 * Setup
 *
 * Setup page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-17
 */
// Ouroboros modules
import brain, { errors } from '@ouroboros/brain';
import { update } from '@ouroboros/brain-react';
import UserDef from '@ouroboros/brain/define/user.json';
import { Parent } from '@ouroboros/define';
import { DefineParent, errorTree } from '@ouroboros/define-mui';
import { combine } from '@ouroboros/tools';
// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// Create the Parents
const PasswdParent = new Parent({
    __name__: 'PSUEDO_Brain_Passwd_New',
    passwd: {
        __type__: 'string',
        __maximum__: 255,
        __ui__: {
            __errors__: {
                'failed regex (custom)': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and be a minimum of 8 characters.'
            },
            __regex__: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
            __title__: 'Set Password',
            __type__: 'password'
        }
    },
    confirm_passwd: {
        __type__: 'string',
        __maximum__: 255,
        __ui__: {
            __errors__: {
                'failed regex (custom)': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and be a minimum of 8 characters.'
            },
            __regex__: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
            __title__: 'Confirm Password',
            __type__: 'password'
        }
    }
});
const UserParent = new Parent(UserDef, {
    __ui__: {
        __update__: [
            'title', 'first_name', 'last_name', 'suffix', 'phone_number',
            'phone_ext'
        ]
    }
});
/**
 * Setup
 *
 * Setting a password and any other user details the first time
 *
 * @name Setup
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Setup(props) {
    // State
    const [user, userSet] = useState(false);
    const [msg, msgSet] = useState({
        type: '',
        content: 'Checking key...'
    });
    // Refs
    const refPasswd = useRef(null);
    const refUpdate = useRef(null);
    // Load effect
    useEffect(() => {
        // Check the key / fetch the data from the server
        brain.read('user/setup', {
            key: props.setupKey
        }).then((data) => {
            if (data) {
                userSet(data);
                msgSet(false);
            }
        }, (error) => {
            if (error.code === errors.body.DB_NO_RECORD) {
                msgSet({
                    type: 'error',
                    content: 'Key is invalid or is associated with a user that is invalid.'
                });
            }
            else {
                return false;
            }
        });
    }, [props.setupKey]);
    // Called to submit the new data and password
    function submit() {
        // If we have no password or update refs
        if (refPasswd.current === null ||
            refUpdate.current === null) {
            return;
        }
        // Fetch the values from the password Parent
        const oPasswd = refPasswd.current.value;
        // If the password is empty
        if (!oPasswd.passwd || oPasswd.passwd.trim() === '') {
            refPasswd.current.error({
                passwd: 'Please create a password'
            });
            return false;
        }
        // If the passwords do not match
        if (oPasswd.passwd !== oPasswd.confirm_passwd) {
            refPasswd.current.error({
                confirm_passwd: 'Passwords don\'t match'
            });
            return false;
        }
        // Fetch the values from the user parent and add them to the setup data
        const oSetup = combine({
            key: props.setupKey,
            passwd: oPasswd.passwd
        }, refUpdate.current.value);
        // Send the data to the server
        brain.update('user/setup', oSetup).then((data) => {
            // If we got data
            if (data) {
                // Set the session
                brain.session(data);
                // Update the signed in user
                update().then(() => {
                    if (props.onSuccess) {
                        props.onSuccess();
                    }
                });
            }
        }, (error) => {
            if (error.code === errors.body.DATA_FIELDS) {
                const oTree = errorTree(error.msg);
                refPasswd.current?.error(oTree);
                refUpdate.current?.error(oTree);
            }
            else if (error.code === errors.body.DB_NO_RECORD) {
                msgSet({
                    type: 'error',
                    content: 'Key is invalid or is associated with a user that is invalid.'
                });
            }
            else if (error.code === errors.PASSWORD_STRENGTH) {
                refPasswd.current?.error([
                    ['passwd', 'Not strong enough']
                ]);
            }
            else {
                return false;
            }
        });
    }
    // Render
    return (React.createElement(Container, { maxWidth: "sm", id: "setup", className: "padding" },
        React.createElement("h1", null, "Setup Your Account"),
        msg ?
            React.createElement(Box, { className: msg.type },
                React.createElement(Typography, null, msg.content))
            :
                React.createElement(Box, null,
                    React.createElement(DefineParent, { gridSizes: { __default__: { xs: 12 } }, label: "placeholder", name: "passwd", ref: refPasswd, node: PasswdParent, type: "create" }),
                    React.createElement("br", null),
                    React.createElement(DefineParent, { gridSizes: {
                            title: { xs: 12, md: 4 },
                            first_name: { xs: 12, md: 8 },
                            last_name: { xs: 12, md: 8 },
                            suffix: { xs: 12, md: 4 },
                            phone_number: { xs: 12, md: 8 },
                            phone_ext: { xs: 12, md: 4 }
                        }, label: "placeholder", ref: refUpdate, name: "user", node: UserParent, type: "update", value: user }),
                    React.createElement(Box, { className: "actions" },
                        React.createElement(Button, { color: "primary", onClick: submit, variant: "contained" }, "Submit")))));
}
// Valid props
Setup.propTypes = {
    mobile: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func,
    setupKey: PropTypes.string.isRequired
};
