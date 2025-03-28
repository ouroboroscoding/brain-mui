/**
 * Permissions
 *
 * Handles permissions associated with a User
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-03-06
 */
import PropTypes from 'prop-types';
import React from 'react';
export type PermissionsProps = {
    ids?: Record<string, string>;
    onClose: () => void;
    onUpdate?: () => void;
    portals: PortalsStruct;
    value: Record<string, Record<string, number>>;
};
export type PermissionsRecord = Record<string, Record<string, number>>;
export type PermissionStruct = {
    name: string;
    title: string;
    allowed: number;
};
export type PortalsStruct = {
    [portal: string]: {
        title: string;
        permissions: SectionStruct[];
    };
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
declare function Permissions({ ids, onClose, onUpdate, portals, value }: PermissionsProps): React.JSX.Element;
declare namespace Permissions {
    var propTypes: {
        ids: PropTypes.Requireable<{
            [x: string]: string | null | undefined;
        }>;
        onClose: PropTypes.Validator<(...args: any[]) => any>;
        onUpdate: PropTypes.Requireable<(...args: any[]) => any>;
        portals: PropTypes.Validator<{
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
        value: PropTypes.Requireable<PropTypes.InferProps<{
            _id: PropTypes.Validator<string>;
        }>>;
    };
}
export default Permissions;
