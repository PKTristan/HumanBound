import { csrfFetch } from './csrf';

const LOAD_USER = 'user/LOAD_USER';
const DELETE_USER = 'user/DELETE_USER';
const LOAD_ERR = 'user/LOAD_ERR';
const CLEAR_ERR = 'user/CLEAR_ERR';


const loadUser = (user) => ({
    type: LOAD_USER,
    user
});

const loadErr = (err) => ({
    type: LOAD_ERR,
    err
});

const delUser = (message) => ({
    type: DELETE_USER,
    message
});

export const clearErr = () => ({
    type: CLEAR_ERR
});

export const getUser = () => async (dispatch) => {
    const response = await csrfFetch('/api/session').catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();

        dispatch(loadUser(data.user));
    }


    return response;
};

export const signupUser = (user, setIsOpen) => async (dispatch) => {
    const response = await csrfFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(user)
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });


    if (response && response.ok) {
        const data = await response.json();
        if(setIsOpen) {
            setIsOpen(false);
        }
        dispatch(loadUser(data.user));
    }


    return response;
};


export const loginUser = (body, setIsOpen=null) => async (dispatch) => {
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify(body),
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();
        if (setIsOpen) {
            setIsOpen(false);
        }
        dispatch(loadUser(data.user));
    }


    return response;

};



export const logout = () => async(dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE'
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });


    if (response && response.ok) {
        const data = await response.json();
        dispatch(delUser(data.message));
    }

    return response;
}



//state selectors
export const selUser = (state) => state.user.session;
export const selErr = (state) => state.user.errors;
export const selMsg = (state) => state.user.messages;



const initialState = { session: null, errors: null, messages: null };

export default function userReducer(state = initialState, action) {
    let mutState = Object.assign(state);

    switch (action.type) {
        case LOAD_USER:
            return { ...mutState, session: action.user, errors: null, messages: null };

        case DELETE_USER:
            return { ...mutState, session: null, messages: action.message, errors: null };

        case LOAD_ERR:
            return {...mutState, errors: action.err};

        case CLEAR_ERR:
            return {...mutState, errors: null};

        default:
            return mutState;
    }
};
