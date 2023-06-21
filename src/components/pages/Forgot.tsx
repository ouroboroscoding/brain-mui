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
import { Parent } from '@ouroboros/define';
import { DefineParent, errorTree } from '@ouroboros/define-mui';

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

// Create the Parent
const PasswdParent = new Parent({
	__name__: 'PSUEDO_Brain_Passwd_Change',
	passwd: {
		__type__: 'string',
		__maximum__: 255,
		__ui__: {
			__errors__: {
				'failed regex (custom)': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and be a minimum of 8 characters.'
			},
			__regex__: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
			__title__: 'Password',
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

// Types
import { responseErrorStruct } from '@ouroboros/body';
export type ForgotProps = {
	mobile: boolean,
	onSuccess?: () => void,
	forgotKey: string
}

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
export default function Forgot(props: ForgotProps) {

	// State
	const [errorMsg, errorMsgSet] = useState<string | false>(false);

	// Refs
	const refPasswd = useRef<DefineParent>(null);

	// Trap enter clicks to trigger sign in
	function keyPressed(event: React.KeyboardEvent<HTMLInputElement>) {
		if(event.key === 'Enter') {
			submit();
		}
	}

	// Called to change password
	function submit() {

		// If we have no password ref
		if(refPasswd.current === null) {
			return;
		}

		// Reset error message
		errorMsgSet(false);

		// Fetch the values from the password Parent
		const oPasswd = refPasswd.current.value;

		// If the password is empty
		if(!oPasswd.passwd || oPasswd.passwd.trim() === '') {
			refPasswd.current.error({
				passwd: 'Please create a password'
			});
			return false;
		}

		// If the passwords do not match
		if(oPasswd.passwd !== oPasswd.confirm_passwd) {
			refPasswd.current.error({
				confirm_passwd: 'Passwords don\'t match'
			});
			return false;
		}

		// Make the request to the server
		brain.update('user/passwd/forgot', {
			key: props.forgotKey,
			passwd: oPasswd.passwd
		}).then((data: boolean) => {
			if(data) {
				if(props.onSuccess) {
					props.onSuccess();
				}
			}
		}, (error: responseErrorStruct) => {
			if(error.code === errors.body.DB_NO_RECORD) {
				errorMsgSet('Invalid Key. Please make sure you copied the URL from your email correctly.');
			} else if(error.code === errors.PASSWORD_STRENGTH) {
				refPasswd.current?.error({
					passwd: 'failed regex (custom)'
				});
			} else {
				errorMsgSet(JSON.stringify(error, null, 4));
			}
		});
	}

	// Render
	return (
		<Dialog
			aria-labelledby="forgot-dialog-title"
			fullWidth={true}
			id="forgot"
			maxWidth="sm"
			open={true}
		>
			<DialogTitle id="signin-dialog-title">Please change your password</DialogTitle>
			<DialogContent dividers>
				{errorMsg &&
					<Box className="error">{errorMsg}</Box>
				}
				<br />
				<DefineParent
					gridSizes={{__default__: {xs: 12}}}
					label="placeholder"
					name="passwd"
					ref={refPasswd}
					node={PasswdParent}
					type="create"
				/>
			</DialogContent>
			<DialogActions className="flexColumns">
				<Button
					onClick={submit}
					variant="contained"
				>
					Change Password
				</Button>
			</DialogActions>
		</Dialog>
	);
}

// Valid props
Forgot.propTypes = {
	mobile: PropTypes.bool.isRequired,
	onSuccess: PropTypes.func,
	forgotKey: PropTypes.string.isRequired
}