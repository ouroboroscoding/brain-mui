/**
 * Shared
 *
 * Holds the Tree and grid sizes used by all the components
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-08-07
 */

// Ouroboros modules
import UserDef from '@ouroboros/brain/definitions/user.json';
import { Tree } from '@ouroboros/define';

// Types
import { gridSizesStruct } from '@ouroboros/define-mui/src/DefineParent';

// Generate the user Tree
export const UserTree = new Tree(UserDef, {
	__ui__: {
		__create__: ['email', 'title', 'first_name', 'last_name', 'suffix', 'phone_number', 'phone_ext'],
		__results__: ['_id', 'email', 'title', 'first_name', 'last_name', 'suffix'],
		__search__: ['_id', 'email', 'first_name', 'last_name', 'phone_number'],
		__update__: ['title', 'first_name', 'last_name', 'suffix', 'phone_number', 'phone_ext']
	},
	title: { __ui__: { __title__: 'Dr. Mrs. Miss...'}},
	suffix: { __ui__: { __title__: 'PhD, RN, Esq...'}}
});

// Grid Sizes
export const GRID_SIZES: gridSizesStruct = {
	__default__: {xs:12},
	title: {xs: 12, sm: 3, lg: 2},
	first_name: {xs: 12, sm: 9, lg: 4},
	last_name: {xs: 12, sm: 9, lg: 4},
	suffix: {xs: 12, sm: 3, lg: 2},
	phone_number: {xs: 12, sm: 8},
	phone_ext: {xs: 12, sm: 4}
};