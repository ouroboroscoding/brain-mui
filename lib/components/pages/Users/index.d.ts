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
import { PortalsStruct } from './Permissions';
import { responseErrorStruct } from '@ouroboros/body';
export type UsersProps = {
    onError?: (error: responseErrorStruct) => void;
    onSuccess?: (type: string, data?: any) => void;
    portals: PortalsStruct;
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
declare function Users({ onError, onSuccess, portals }: UsersProps): React.JSX.Element;
declare namespace Users {
    var propTypes: {
        onError: PropTypes.Requireable<(...args: any[]) => any>;
        onSuccess: PropTypes.Requireable<(...args: any[]) => any>;
        portals: PropTypes.Requireable<{
            [x: string]: Required<PropTypes.InferProps<{
                title: PropTypes.Validator<string>;
                permissions: PropTypes.Validator<(Required<PropTypes.InferProps<{
                    title: PropTypes.Validator<string>;
                    rights: PropTypes.Requireable<(Required<PropTypes.InferProps<{
                        name: PropTypes.Validator<string>;
                        title: PropTypes.Validator<string>;
                        allowed: PropTypes.Validator<number>;
                    }>> | null | undefined)[]>;
                }>> | null | undefined)[]>;
            }>> | null | undefined;
        }>;
    };
}
export default Users;
