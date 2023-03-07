/**
 * Setup
 *
 * Setup page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-17
 */
/// <reference types="react" />
import PropTypes from 'prop-types';
export type SetupProps = {
    mobile: boolean;
    onSuccess?: () => void;
    setupKey: string;
};
/**
 * Setup
 *
 * Setting a password and any other user details the first time
 *
 * @name Setup
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Setup(props: SetupProps): JSX.Element;
declare namespace Setup {
    var propTypes: {
        mobile: PropTypes.Validator<boolean>;
        onSuccess: PropTypes.Requireable<(...args: any[]) => any>;
        setupKey: PropTypes.Validator<string>;
    };
}
export default Setup;
