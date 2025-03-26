/**
 * User Create
 *
 * Create new user component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-08-07
 */

// Ouroboros modules
import brain, { errors } from '@ouroboros/brain';
import { Form } from '@ouroboros/define-mui';

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

// Types
import { responseErrorStruct } from '@ouroboros/body';
export type UserCreateProps = {
	onError?: (error: responseErrorStruct) => void,
	onCancel?: () => void,
	onSuccess?: (data: any) => void,
	setupUrl: string
}

// Constants
import { GRID_SIZES, UserTree } from '../../shared';

/**
 * User Create
 *
 * Handles creating a new user
 *
 * @name UserCreate
 * @access public
 * @param props Properties passed to the component
 * @returns React.Component
 */
export default function UserCreate(props: UserCreateProps) {

	// Called when the form is submitted
	function submit(user: any): Promise<boolean> {

		// Add the url to the user data
		user.url = props.setupUrl

		// Create a new Promise and return it
		return new Promise((resolve, reject) => {

			// Make the request to the server
			brain.create('user', user).then((data: string) => {

				// If we were successful
				if(data) {

					// Add the ID to the user
					user._id = data;

					// If we have an onSuccess prop
					if(props.onSuccess) {
						props.onSuccess(user);
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

	// Render
	return (
		<Form
			gridSizes={GRID_SIZES}
			onCancel={props.onCancel}
			onSubmit={submit}
			tree={UserTree}
			type="create"
		/>
	);
}

// Valid props
UserCreate.propTypes = {
	onCancel: PropTypes.func,
	onError: PropTypes.func,
	onSuccess: PropTypes.func,
	setupUrl: PropTypes.string
}