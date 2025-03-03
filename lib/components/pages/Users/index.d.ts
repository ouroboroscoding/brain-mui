/**
 * Users
 *
 * Users page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-18
 */
import PropTypes from 'prop-types';
import React from 'react';
import { SectionStruct } from './Permissions';
import { responseErrorStruct } from '@ouroboros/body';
export type UsersProps = {
    allowedPermissions: SectionStruct[];
    onError?: (error: responseErrorStruct) => void;
    onSuccess?: (type: string, data?: any) => void;
    portals: Record<string, string>;
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
declare function Users(props: UsersProps): React.JSX.Element;
declare namespace Users {
    var propTypes: {
        allowedPermissions: PropTypes.Validator<(Required<PropTypes.InferProps<{
            title: PropTypes.Validator<string>;
            rights: PropTypes.Requireable<(Required<PropTypes.InferProps<{
                name: PropTypes.Validator<string>;
                title: PropTypes.Validator<string>;
                allowed: PropTypes.Validator<number>;
            }>> | null | undefined)[]>;
        }>> | null | undefined)[]>;
        onError: PropTypes.Requireable<(...args: any[]) => any>;
        onSuccess: PropTypes.Requireable<(...args: any[]) => any>;
        portals: PropTypes.Requireable<object>;
    };
    var defaultProps: {
        portals: {
            '': string;
        };
    };
}
export default Users;
