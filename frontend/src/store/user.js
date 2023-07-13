import { csrfFetch } from './csrf';

const LOAD_USER = 'user/LOAD_USER';
const DELETE_USER = 'user/DELETE_USER';
const LOAD_ERROR = 'user/LOAD_ERROR';
const DELETE_ERROR = 'user/DELETE_ERROR';

const loadUser = (user) => ({
    type: LOAD_USER,
    user
});

const loadError = (error) => ({
    type: LOAD_ERROR,
    error
});

export const signupUser = (user) => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(user)
        });

        const data = await response.json();

        dispatch(loadUser(data));
    }
    catch(err) {
        dispatch(loadError(err));
    }
};


export const loginUser = (body) => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/session', {
            method: 'POST',
            body: JSON.stringify(body)
        });

        const data = response.json();

        dispatch(loadUser(data));
    }
    catch(err) {
        dispatch(loadError(err));
    }
}



//state selectors
export const selUser = (state) => state.user;
export const selErrors = (state) => state.errors;


const initialState = { user: null, errors: null};

export const userReducer = (state = initialState, action) => {
    let mutState = Object.assign(state);

    switch(action.type){
        case LOAD_USER:
            return {...mutState, user: action.user};

        case DELETE_USER:
            return {...mutState, user: null};

        case LOAD_ERROR:
            return {...mutState, errors: action.error };

        case DELETE_ERROR:
            return {...mutState, errors: null};

        default:
            return mutState;
    }
}
