/**
 * Users
 *
 * Users page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-18
 */

// Ouroboros modules
import brain, { errors, RIGHTS } from '@ouroboros/brain';
import { useRights } from '@ouroboros/brain-react';
import { Results, Search } from '@ouroboros/define-mui';
import { arrayFindMerge } from '@ouroboros/tools';

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
import UserCreate from '../../composites/UserCreate';
import UserSearch from '../../composites/UserSearch';

// Local
import Permissions from './Permissions';

// Types
import { actionStruct } from '@ouroboros/define-mui/src/Results/Row';
import { PortalsStruct } from './Permissions';
import { responseErrorStruct } from '@ouroboros/body';
export type UsersProps = {
	onError?: (error: responseErrorStruct) => void,
	onSuccess?: (type: string, data?: any) => void,
	portals: PortalsStruct
}

// Constants
import { GRID_SIZES, UserTree } from '../../../shared';
const SETUP_URL = 'https://' + window.location.host + '/setup/{key}';

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
export default function Users({
	onError,
	onSuccess,
	portals = { '': {
		title: 'Default',
		permissions: [ { title: 'Authorization', rights: [ {
			name: 'brain_user',
			title: 'Users',
			allowed: RIGHTS.CREATE | RIGHTS.READ | RIGHTS.UPDATE
		}, {
			name: 'brain_permission',
			title: 'Permissions',
			allowed: RIGHTS.READ | RIGHTS.UPDATE
		} ] } ]
	} }
}: UsersProps) {

	// State
	const [ createForm, createFormSet ] = useState<boolean>(false);
	const [ password, passwordSet ] = useState<string | false>(false);
	const [ records, recordsSet ] = useState<any[]>([]);

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

	}, [ rightsUser ]);

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
				if(onSuccess) {
					onSuccess('password');
				}
				passwordSet(false);
			}
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
					if(onSuccess) {
						onSuccess('update', user);
					}

					// Update the records
					recordsSet(l =>
						arrayFindMerge(l, '_id', user._id, user, true) as any);
				}

				// Resolve
				resolve(data);

			}, (error: responseErrorStruct) => {
				if(error.code === errors.body.DATA_FIELDS) {
					reject(error.msg);
				} else {
					if(onError) {
						onError(error);
					} else {
						throw new Error(JSON.stringify(error));
					}
				}
			});
		});
	}

	// Init the actions
	const lActions: actionStruct[] = [];

	// If the user can create users
	if(rightsUser.create) {
		lActions.push({
			tooltip: 'Re-send Setup E-Mail',
			icon: 'fa-solid fa-envelope',
			callback: user => {
				brain.create('user/setup/send', {
					_id: user._id,
					url: SETUP_URL
				}).then(data => {
					if(data) {
						if(onSuccess) {
							onSuccess('setup_sent');
						}
					}
				}, (error: responseErrorStruct) => {
					if(error.code === errors.body.ALREADY_DONE) {
						if(onSuccess) {
							onSuccess('setup_done');
						}
					} else {
						if(onError) {
							onError(error);
						} else {
							throw new Error(JSON.stringify(error));
						}
					}
				});
			}
		});
	}

	// If the user can change permissions
	if(rightsPermission.update) {
		lActions.push({
			tooltip: "Edit User's permissions",
			icon: 'fa-solid fa-list',
			component: Permissions as unknown as React.FunctionComponent<{ onClose: () => void; value: Record<string, any>; }>,
			props: {
				onUpdate: () => {
					if(onSuccess) {
						onSuccess('permissions');
					}
				},
				portals
			}
		});
	}

	// If the user can update other users
	if(rightsUser.update) {
		lActions.push({
			tooltip: "Change User's password",
			icon: 'fa-solid fa-unlock-keyhole',
			callback: user => passwordSet(user._id)
		});
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
					<UserCreate
						onCancel={() => createFormSet(false)}
						onError={onError}
						onSuccess={(user: any) => {
							createFormSet(false);
							recordsSet([user]);
							if(refSearch.current) {
								refSearch.current.reset();
							}
						}}
						setupUrl={SETUP_URL}
					/>
				</Paper>
			}
			{rightsUser.read &&
				<UserSearch
					onSuccess={recordsSet}
				/>
			}
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
	onError: PropTypes.func,
	onSuccess: PropTypes.func,
	portals: PropTypes.objectOf(PropTypes.exact({
		title: PropTypes.string.isRequired,
		permissions: PropTypes.arrayOf(PropTypes.exact({
			title: PropTypes.string.isRequired,
			rights: PropTypes.arrayOf(PropTypes.exact({
				name: PropTypes.string.isRequired,
				title: PropTypes.string.isRequired,
				allowed: PropTypes.number.isRequired
			}))
		})).isRequired
	}) )
}