/**
 * Verification
 *
 * Verification page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-17
 */

// Ouroboros modules
import brain, { errors } from '@ouroboros/brain';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// Types
import { responseErrorStruct } from '@ouroboros/body';
export type VerificationProps = {
	onSuccess: () => void,
	verificationKey: string
}

/**
 * Verification
 *
 * Handles verifying the email and reporting success/failure
 *
 * @name Verification
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Verification(props: VerificationProps) {

	// State
	const [msg, msgSet] = useState({
		type: '',
		content: 'Checking key...'
	});

	// Load effect
	useEffect(() => {

		// Send the key to the server to verify
		brain.update('user/email/verify', {
			key: props.verificationKey
		}).then((data: boolean) => {
			if(data) {
				msgSet({
					type: 'success',
					content: 'Successfully verified your e-mail address. You will be redirected to the homepage shortly.'
				});

				if(props.onSuccess) {
					props.onSuccess();
				}
			}
		}, (error: responseErrorStruct) => {
			if(error.code === errors.body.DB_NO_RECORD) {
				msgSet({
					type: 'error',
					content: 'Can not verify, key is invalid. Please make sure you copied the URL correctly. Contact support if you continue to have issues.'
				});
			} else {
				return false;
			}
		});

	}, [props.verificationKey]);

	// Render
	return (
		<Container maxWidth="sm" id="verify" className="padding">
			<Box className={msg.type}>
				<Typography>{msg.content}</Typography>
			</Box>
		</Container>
	);
}

// Valid props
Verification.propTypes = {
	onSuccess: PropTypes.func,
	verificationKey: PropTypes.string.isRequired
}