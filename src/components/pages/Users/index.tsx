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

// Types
import { actionStruct, componentConstructor } from '@ouroboros/define-mui/src/Results/Row';
import { gridSizesStruct } from '@ouroboros/define-mui/src/DefineParent';
import { SectionStruct } from './Permissions';
import { responseErrorStruct } from '@ouroboros/body';
export type UsersProps = {
	allowedPermissions: SectionStruct,
	onError?: (error: responseErrorStruct) => void,
	onSuccess?: (type: string, data?: any) => void
}

// Generate the user Tree
const UserTree = new Tree(UserDef, {
	__ui__: {
		__create__: ['email', 'title', 'first_name', 'last_name', 'suffix', 'phone_number', 'phone_ext'],
		__results__: ['_id', 'email', 'title', 'first_name', 'last_name', 'suffix'],
		__search__: ['_id', 'email', 'first_name', 'last_name', 'phone_number'],
		__update__: ['title', 'first_name', 'last_name', 'suffix', 'phone_number', 'phone_ext']
	},
	title: { __ui__: { __title__: 'Dr. Mrs. Miss...'}},
	suffix: { __ui__: { __title__: 'PhD, RN, Esq...'}}
});

// Constants
const GRID_SIZES: gridSizesStruct = {
	__default__: {xs:12},
	title: {xs: 12, sm: 3, lg: 2},
	first_name: {xs: 12, sm: 9, lg: 4},
	last_name: {xs: 12, sm: 9, lg: 4},
	suffix: {xs: 12, sm: 3, lg: 2},
	phone_number: {xs: 12, sm: 8},
	phone_ext: {xs: 12, sm: 4}
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
export default function Users(props: UsersProps) {

	// State
	const [createForm, createFormSet] = useState<boolean>(false);
	const [password, passwordSet] = useState<string | false>(false);
	const [records, recordsSet] = useState<any[]>([]);

	// Hooks
	const rightsPermission = useRights('brain_permission');
	const rightsUser = useRights('brain_user');

	// Refs
	const refPasswd = useRef<HTMLInputElement>(null);
	const refSearch = useRef<Search>(null);

	// User permissions change effect
	useEffect(() => {

		// If we have a read right
		if(rightsUser.read) {
			if(refSearch.current) {
				refSearch.current.query();
			}
		} else {
			recordsSet([]);
		}

		// If we don't have create access
		if(!rightsUser.create) {
			createFormSet(false);
		}

		// If we can't update
		if(!rightsUser.update) {
			passwordSet(false);
		}

	}, [rightsUser]);

	// Called when the create form is submitted
	function create(user: any): Promise<boolean> {

		// Add the url to the user data
		user.url = 'https://' + window.location.host + '/setup/{key}'

		// Create a new Promise and return it
		return new Promise((resolve, reject) => {

			// Make the request to the server
			brain.create('user', user).then((data: string) => {

				// If we were successful
				if(data) {

					// If we have an onSuccess prop
					if(props.onSuccess) {
						props.onSuccess('create', user);
					}

					// Add the ID to the user
					user._id = data;

					// Hide the form, overwrite the results, and clear the
					//	search
					createFormSet(false);
					recordsSet([user]);
					if(refSearch.current) {
						refSearch.current.reset();
					}
				}

				// Resolve
				resolve(true);

			}, (error: responseErrorStruct) => {
				if(error.code === errors.body.DATA_FIELDS) {
					reject(error.msg);
				} else if(error.code === errors.body.DB_DUPLICATE) {
					reject({email: 'Already in use'});
				} else {
					if(props.onError) {
						props.onError(error);
					} else {
						throw new Error(JSON.stringify(error));
					}
				}
			});
		});
	}

	// Called to update the user's password
	function passwordUpdate() {

		// If we don't have a new password
		if(!refPasswd.current) {
			return;
		}

		// Update the agent's password
		brain.update('user/passwd', {
			_id: password, // user ID is stored in password state
			new_passwd: refPasswd.current.value
		}).then((data: boolean) => {
			if(data) {
				if(props.onSuccess) {
					props.onSuccess('password');
				}
				passwordSet(false);
			}
		});
	}

	// Called when search is submitted
	function search(filter: any): Promise<boolean> {

		// Create a new Promise and return it
		return new Promise((resolve, reject) => {

			// Fetch the records from the server
			brain.read('search', { filter }).then((data: any[]) => {

				// Set the new records
				recordsSet(data);

				// Resolve
				resolve(true);

			}, (error: responseErrorStruct) => {
				if(error.code === errors.body.DATA_FIELDS) {
					reject(error.msg);
				} else {
					if(props.onError) {
						props.onError(error);
					}
				}
			});
		});
	}

	// Called when update form is submitted
	function update(user: any, key: any): Promise<boolean> {

		// Add the key to the user
		user._id = key;

		// Create a new Promise and return it
		return new Promise((resolve, reject) => {

			// Send the request to the server
			brain.update('user', user).then((data: boolean) => {

				// If we got success
				if(data) {

					// If we have an onSuccess prop
					if(props.onSuccess) {
						props.onSuccess('update', user);
					}

					// Look for the record
					const i = afindi(records, '_id', user._id);

					// If it exists
					if(i > -1) {

						// Clone the records, update the index, and set the new records
						const lUsers = clone(records);
						merge(lUsers[i], user);
						recordsSet(lUsers);
					}
				}

				// Resolve
				resolve(data);

			}, (error: responseErrorStruct) => {
				if(error.code === errors.body.DATA_FIELDS) {
					reject(error.msg);
				} else {
					if(props.onError) {
						props.onError(error);
					} else {
						throw new Error(JSON.stringify(error));
					}
				}
			});
		});
	}

	// Init the actions
	const lActions: actionStruct[] = [];

	// If the user can change permissions
	if(rightsPermission.update) {
		lActions.push({
			tooltip: "Edit User's permissions",
			icon: 'fa-solid fa-list',
			component: Permissions as unknown as React.FunctionComponent<{ onClose: () => void; value: Record<string, any>; }>,
			props: {
				sections: props.allowedPermissions,
				onUpdate: () => {
					if(props.onSuccess) {
						props.onSuccess('permissions');
					}
				}
			}
		});
	}

	// If the user can update other users
	if(rightsUser.update) {
		lActions.push({tooltip: "Change User's password", icon: 'fa-solid fa-unlock-keyhole', callback: user => passwordSet(user._id)});
	}

	// Render
	return (
		<Box id="users" className="flexGrow padding">
			<Box className="flexColumns">
				<h1 className="flexGrow">Users</h1>
				{rightsUser.create &&
					<Box className="flexStatic">
						<Tooltip title="Create new User" className="page_action" onClick={() => createFormSet(val => !val)}>
							<IconButton>
								<i className={'fa-solid fa-user-plus' + (createForm ? ' open' : '')} />
							</IconButton>
						</Tooltip>
					</Box>
				}
			</Box>
			{rightsUser.create && createForm &&
				<Paper className="padding">
					<Form
						gridSizes={GRID_SIZES}
						onCancel={() => createFormSet(false)}
						onSubmit={create}
						tree={UserTree}
						type="create"
					/>
				</Paper>
			}
			<Search
				hash="users"
				name="users"
				onSearch={search}
				ref={refSearch}
				tree={UserTree}
			/>
			<Results
				actions={lActions}
				data={records}
				gridSizes={GRID_SIZES}
				onUpdate={rightsUser.update ? update : false}
				orderBy="email"
				tree={UserTree}
			/>
			{password &&
				<Dialog
					aria-labelledby="password-dialog-title"
					maxWidth="lg"
					onClose={ev => passwordSet(false)}
					open={true}
				>
					<DialogTitle id="password-dialog-title">Update Password</DialogTitle>
					<DialogContent dividers>
						<TextField
							label="New Password"
							inputRef={refPasswd}
						/>
					</DialogContent>
					<DialogActions>
						<Button variant="contained" color="secondary" onClick={ev => passwordSet(false)}>
							Cancel
						</Button>
						<Button variant="contained" color="primary" onClick={passwordUpdate}>
							Update
						</Button>
					</DialogActions>
				</Dialog>
			}
		</Box>
	);
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
}