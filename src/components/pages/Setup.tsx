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
import UserDef from '@ouroboros/brain/definitions/user.json';
import clone from '@ouroboros/clone';
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

// Local modules
import { update } from '../../Myself';

// Create the Parents
const PasswdParent = new Parent({
	__name__: 'PSUEDO_Brain_Passwd_New',
	passwd: {
		__type__: 'string',
		__maximum__: 255,
		__ui__: { regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
				title: 'Set Password', type: 'password' }
	},
	confirm_passwd: {
		__type__: 'string',
		__maximum__: 255,
		__ui__: { regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
				title: 'Confirm Password', type: 'password' }
	}
});
const UserParent = new Parent(clone(UserDef));

// Types
import { responseErrorStruct } from '@ouroboros/body';
export type SetupProps = {
	mobile: boolean,
	onSuccess?: () => void,
	setupKey: string
}

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
export default function Setup(props: SetupProps) {

	// State
	const [user, userSet] = useState<any>(false);
	const [msg, msgSet] = useState<any>({
		type: '',
		content: 'Checking key...'
	});

	// Refs
	const refPasswd = useRef<DefineParent>(null);
	const refUpdate = useRef<DefineParent>(null);

	// Load effect
	useEffect(() => {

		// Check the key / fetch the data from the server
		brain.read('user/setup', {
			key: props.setupKey
		}).then((data: boolean) => {
			if(data) {
				userSet(data);
				msgSet(false);
			}
		}, (error: responseErrorStruct) => {
			if(error.code === errors.body.DB_NO_RECORD) {
				msgSet({
					type: 'error',
					content: 'Key is invalid or is associated with a user that is invalid.'
				});
			} else {
				return false;
			}
		});

	}, [props.setupKey]);

	// Called to submit the new data and password
	function submit() {

		// If we have no password or update refs
		if(refPasswd.current === null ||
			refUpdate.current === null) {
			return;
		}

		// Fetch the values from the password Parent
		const oPasswd = refPasswd.current.value;

		// If the password is empty
		if(!oPasswd.passwd || oPasswd.passwd.trim() === '') {
			refPasswd.current.error({
				passwd: 'Please create a password'
			});
			return false;
		}

		if(oPasswd.passwd !== oPasswd.confirm_passwd) {
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
		brain.update('user/setup', oSetup).then((data: string) => {

			// If we got data
			if(data) {

				// Set the session
				brain.session(data);

				// Update the signed in user
				update().then(() => {
					if(props.onSuccess) {
						props.onSuccess();
					}
				});
			}
		}, (error: responseErrorStruct) => {
			if(error.code === errors.body.DATA_FIELDS) {
				const oTree = errorTree(error.msg);
				refPasswd.current?.error(oTree);
				refUpdate.current?.error(oTree);
			}
			else if(error.code === errors.body.DB_NO_RECORD) {
				msgSet({
					type: 'error',
					content: 'Key is invalid or is associated with a user that is invalid.'
				});
			}
			else if(error.code === errors.PASSWORD_STRENGTH) {
				refPasswd.current?.error([
					['passwd', 'Not strong enough']
				]);
			} else {
				return false;
			}
		});
	}

	// Render
	return (
		<Container maxWidth="sm" id="setup" className="padding">
			<h1>Setup Your Account</h1>
			{msg ?
				<Box className={msg.type}>
					<Typography>{msg.content}</Typography>
				</Box>
			:
				<Box>
					<DefineParent
						gridSizes={{__default__: {xs: 12}}}
						label="placeholder"
						name="passwd"
						ref={refPasswd}
						node={PasswdParent}
						type="create"
					/>
					<br />
					<DefineParent
						gridSizes={{__default__: {xs: 12}}}
						label="placeholder"
						ref={refUpdate}
						name="user"
						node={UserParent}
						type="update"
						value={user}
					/>
					<Box className="actions">
						<Button color="primary" onClick={submit} variant="contained">Submit</Button>
					</Box>
				</Box>
			}
		</Container>
	);
}

// Valid props
Setup.propTypes = {
	mobile: PropTypes.bool.isRequired,
	onSuccess: PropTypes.func,
	setupKey: PropTypes.string.isRequired
}