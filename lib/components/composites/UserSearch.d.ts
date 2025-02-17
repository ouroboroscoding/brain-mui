/**
 * User Search
 *
 * Search users component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-08-07
 */
import PropTypes from 'prop-types';
import React from 'react';
import { responseErrorStruct } from '@ouroboros/body';
export type UserSearchProps = {
    onError?: (error: responseErrorStruct) => void;
    onSuccess?: (records: any[]) => void;
};
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
declare function UserSearch(props: UserSearchProps): React.JSX.Element;
declare namespace UserSearch {
    var propTypes: {
        onError: PropTypes.Requireable<(...args: any[]) => any>;
        onSuccess: PropTypes.Requireable<(...args: any[]) => any>;
    };
}
export default UserSearch;
