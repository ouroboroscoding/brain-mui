/**
 * Users
 *
 * Users page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-18
 */
/// <reference types="react" />
import PropTypes from 'prop-types';
import { PortalStruct, SectionStruct } from './Permissions';
import { responseErrorStruct } from '@ouroboros/body';
export type UsersProps = {
    allowedPermissions: SectionStruct[];
    onError?: (error: responseErrorStruct) => void;
    onSuccess?: (type: string, data?: any) => void;
    portals: PortalStruct[];
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
declare function Users(props: UsersProps): JSX.Element;
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
        portals: PropTypes.Requireable<(Required<PropTypes.InferProps<{
            key: PropTypes.Requireable<string>;
            title: PropTypes.Validator<string>;
        }>> | null | undefined)[]>;
    };
    var defaultProps: {
        portals: {
            key: string;
            title: string;
        }[];
    };
}
export default Users;
