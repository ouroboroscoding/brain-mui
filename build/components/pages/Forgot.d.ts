/**
 * Forgot
 *
 * Forgot page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-17
 */
import PropTypes from 'prop-types';
import React from 'react';
export type ForgotProps = {
    mobile: boolean;
    onSuccess?: () => void;
    forgotKey: string;
};
/**
 * Forgot
 *
 * Handles forgotten password / reset dialog
 *
 * @name Forgot
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Forgot(props: ForgotProps): React.JSX.Element;
declare namespace Forgot {
    var propTypes: {
        mobile: PropTypes.Validator<boolean>;
        onSuccess: PropTypes.Requireable<(...args: any[]) => any>;
        forgotKey: PropTypes.Validator<string>;
    };
}
export default Forgot;
