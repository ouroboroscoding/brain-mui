/**
 * User Search
 *
 * Search users component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-08-07
 */
// Ouroboros modules
import brain, { errors } from '@ouroboros/brain';
import { Search } from '@ouroboros/define-mui';
// NPM modules
import PropTypes from 'prop-types';
import React from 'react';
// Constants
import { UserTree } from '../../shared';
/**
 * User Search
 *
 * Handles displaying the form to search for users
 *
 * @name UserSearch
 * @access public
 * @param props Properties passed to the component
 * @returns React.Component
 */
export default function UserSearch(props) {
    // Called when search is submitted
    function search(filter) {
        // Create a new Promise and return it
        return new Promise((resolve, reject) => {
            // Fetch the records from the server
            brain.read('search', { filter }).then((data) => {
                // Set the new records
                if (props.onSuccess) {
                    props.onSuccess(data);
                }
                // Resolve
                resolve(true);
            }, (error) => {
                if (error.code === errors.body.DATA_FIELDS) {
                    reject(error.msg);
                }
                else {
                    if (props.onError) {
                        props.onError(error);
                    }
                }
            });
        });
    }
    // Render
    return (React.createElement(Search, { hash: "users", name: "users", onSearch: search, tree: UserTree }));
}
// Valid props
UserSearch.propTypes = {
    onError: PropTypes.func,
    onSuccess: PropTypes.func
};
