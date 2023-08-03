import { csrfFetch } from "./csrf";

const LOAD_MSG = 'replies/LOAD_MSG';
const CLEAR_MSG = 'replies/CLEAR_MSG';
const LOAD_ERR = 'replies/LOAD_ERR';
const CLEAR_ERR = 'replies/CLEAR_ERR';


const loadMsg = (msg) => ({
    type: LOAD_MSG,
    msg
});

export const clearMsg = () => ({ type: CLEAR_MSG });

const loadErr = (err) => ({
    type: LOAD_ERR,
    err
});

export const clearErr = () => ({ type: CLEAR_ERR });


export const createReply = (reply, reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}/replies`, {
        method: 'POST',
        body: JSON.stringify({reply})
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();
        dispatch(clearErr());
        dispatch(loadMsg('please relaod'));
    }

    return response;
}

export const editReply = (id, reply) =>async (dispatch) => {
    const response = await csrfFetch(`/api/replies/${id}`, {
        method: 'PUT',
        body: JSON.stringify({reply})
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();
        dispatch(clearErr());
        dispatch(loadMsg(data));
    }

    return response;
}

export const deleteReply = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/replies/${id}`, {
        method: "DELETE"
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();

        dispatch(loadMsg(data));
    }

    return response;
}


// selectors
export const selMsg = (state) => state.reply.message;
export const selErr = (state) => state.reply.errors;

const initialState = { message: null, errors: null };

const repliesReducer = (state=initialState, action) => {
    let mutState = Object.assign(state);

    switch(action.type) {
        case LOAD_MSG:
            return {...mutState, message: action.msg};

        case LOAD_ERR:
            return {...mutState, errors: action.err};

        case CLEAR_MSG:
            return {...mutState, message: null};

        case CLEAR_ERR:
            return {...mutState, errors: null};

        default:
            return mutState;
    }
}


export default repliesReducer
