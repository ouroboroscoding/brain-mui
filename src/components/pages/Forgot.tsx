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
	const [confirm, confirmSet] = useState('');
	const [errorMsg, errorMsgSet] = useState<string | false>(false);
	const [passwd, passwdSet] = useState('');

	// Trap enter clicks to trigger sign in
	function keyPressed(event: React.KeyboardEvent<HTMLInputElement>) {
		if(event.key === 'Enter') {
			submit();
		}
	}

	// Called to change password
	function submit() {

		// Reset error message
		errorMsgSet(false);

		// If the passwords do not match
		if(confirm !== passwd) {
			errorMsgSet('Passwords do not match');
			return;
		}

		// Make the request to the server
		brain.update('user/passwd/forgot', {
			key: props.forgotKey,
			passwd
		}).then((data: boolean) => {
			if(data) {
				if(props.onSuccess) {
					props.onSuccess();
				}
			}
		}, (error: responseErrorStruct) => {
			if(error.code === errors.body.DB_NO_RECORD) {
				errorMsgSet('Invalid Key');
			} else if(error.code === errors.PASSWORD_STRENGTH) {
				errorMsgSet('New password is not strong enough. Must contain at least 1 uppercase letter, at least 1 lowercase letter, and at least 1 number.');
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
					<div className="error">{errorMsg}</div>
				}
				<br />
				<Box className="field">
					<TextField
						label="Password"
						onChange={ev => passwdSet(ev.target.value)}
						onKeyPress={keyPressed}
						placeholder="Password"
						type="password"
						value={passwd}
					/>
				</Box>
				<Box className="field">
					<TextField
						label="Confirm Password"
						onChange={ev => confirmSet(ev.target.value)}
						onKeyPress={keyPressed}
						placeholder="Confirm Password"
						type="password"
						value={confirm}
					/>
				</Box>
			</DialogContent>
			<DialogActions className="flexColumns">
				<Button
					disabled={passwd.trim() === '' || confirm.trim() === ''}
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