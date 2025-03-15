/**
 * Shared
 *
 * Holds the Tree and grid sizes used by all the components
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-08-07
 */
// Ouroboros modules
import { Tree } from '@ouroboros/define';
// Brain user definition file
import UserDef from '@ouroboros/brain/define/user.json';
// Generate the user Tree
export const UserTree = new Tree(UserDef, {
    __name__: 'record',
    __ui__: {
        __create__: [
            'email', 'title', 'first_name', 'last_name', 'suffix',
            'phone_number', 'phone_ext'
        ],
        __results__: [
            '_id', 'email', 'title', 'first_name', 'last_name', 'suffix'
        ],
        __search__: [
            '_id', 'email', 'first_name', 'last_name', 'phone_number'
        ],
        __update__: [
            'title', 'first_name', 'last_name', 'suffix', 'phone_number',
            'phone_ext'
        ]
    },
    _id: { __ui__: { __title__: 'Unique ID' } },
    email: { __ui__: { __title__: 'E-Mail Address' } },
    passwd: { __ui__: {
            __regex__: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
            __title__: 'Password',
            __type__: 'password'
        } },
    locale: { __ui__: {
            __options__: [['en-US', 'U.S. English']],
            __title__: 'Language',
            __type__: 'hidden'
        } },
    first_name: { __ui__: { __title__: 'Given Name' } },
    last_name: { __ui__: { __title__: 'Surname' } },
    title: { __ui__: { __title__: 'Title (e.g. Dr., Mrs., Miss, Lord, etc)' } },
    suffix: { __ui__: { __title__: 'Suffix (e.g. PhD, RN, Esq)' } },
    phone_number: { '__ui__': {
            __title__: 'Phone Number',
            __type__: 'phone_number'
        } },
    phone_ext: { __ui__: { __title__: 'Extension' } }
});
// Grid Sizes
export const GRID_SIZES = {
    __default__: { xs: 12 },
    title: { xs: 12, sm: 3, lg: 2 },
    first_name: { xs: 12, sm: 9, lg: 4 },
    last_name: { xs: 12, sm: 9, lg: 4 },
    suffix: { xs: 12, sm: 3, lg: 2 },
    phone_number: { xs: 12, sm: 8 },
    phone_ext: { xs: 12, sm: 4 }
};
