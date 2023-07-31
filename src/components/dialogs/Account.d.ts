/**
 * Account
 *
 * Handles signed in user's data
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-17
 */
import PropTypes from 'prop-types';
import React from 'react';
import { responseErrorStruct } from '@ouroboros/body';
import { userType } from '@ouroboros/brain-react';
export type AccountProps = {
    onClose: () => void;
    onDetailsChanged?: (user: userType) => void;
    onEmailChanged?: (email: string) => void;
    onError?: (error: responseErrorStruct) => void;
    onPasswdChanged?: () => void;
    verificationUrl: string;
};
/**
 * Account
 *
 * Shows dialog for user to edit their account data
 *
 * @name Account
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Account(props: AccountProps): React.JSX.Element | null;
declare namespace Account {
    var propTypes: {
        onClose: PropTypes.Validator<(...args: any[]) => any>;
        onDetailsChanged: PropTypes.Requireable<(...args: any[]) => any>;
        onEmailChanged: PropTypes.Requireable<(...args: any[]) => any>;
        onError: PropTypes.Requireable<(...args: any[]) => any>;
        onPasswdChanged: PropTypes.Requireable<(...args: any[]) => any>;
        verificationUrl: PropTypes.Validator<string>;
    };
}
export default Account;
