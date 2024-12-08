/**
 * User Create
 *
 * Create new user component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-08-07
 */
import PropTypes from 'prop-types';
import React from 'react';
import { responseErrorStruct } from '@ouroboros/body';
export type UserCreateProps = {
    onError?: (error: responseErrorStruct) => void;
    onCancel?: () => void;
    onSuccess?: (type: string, data?: any) => void;
    setupUrl: string;
};
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
declare function UserCreate(props: UserCreateProps): React.JSX.Element;
declare namespace UserCreate {
    var propTypes: {
        onCancel: PropTypes.Requireable<(...args: any[]) => any>;
        onError: PropTypes.Requireable<(...args: any[]) => any>;
        onSuccess: PropTypes.Requireable<(...args: any[]) => any>;
        setupUrl: PropTypes.Requireable<string>;
    };
}
export default UserCreate;
