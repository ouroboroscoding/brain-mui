/**
 * Permissions
 *
 * Handles permissions associated with a User
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-03-06
 */
/// <reference types="react" />
import PropTypes from 'prop-types';
export type PermissionsProps = {
    onClose: () => void;
    onUpdate?: () => void;
    sections: SectionStruct[];
    value: Record<string, number>;
};
export type PermissionsRecord = {
    _user: string;
    _created?: number;
    _updated?: number;
    rights: Record<string, number>;
};
export type PermissionStruct = {
    name: string;
    title: string;
    allowed: number;
};
export type SectionStruct = {
    title: string;
    rights: PermissionStruct[];
};
/**
 * Permissions
 *
 * Shows all permissions for a specific user
 *
 * @name Permissions
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Permissions(props: PermissionsProps): JSX.Element;
declare namespace Permissions {
    var propTypes: {
        onClose: PropTypes.Validator<(...args: any[]) => any>;
        onUpdate: PropTypes.Requireable<(...args: any[]) => any>;
        sections: PropTypes.Validator<(Required<PropTypes.InferProps<{
            title: PropTypes.Validator<string>;
            rights: PropTypes.Requireable<(Required<PropTypes.InferProps<{
                name: PropTypes.Validator<string>;
                title: PropTypes.Validator<string>;
                allowed: PropTypes.Validator<number>;
            }>> | null | undefined)[]>;
        }>> | null | undefined)[]>;
        value: PropTypes.Requireable<PropTypes.InferProps<{
            _id: PropTypes.Validator<string>;
        }>>;
    };
}
export default Permissions;
