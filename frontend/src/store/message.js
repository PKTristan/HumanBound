import { csrfFetch } from "./csrf";

const LOAD_MESSAGES = "message/LOAD_MESSAGES";
const CLEAR_MESSAGES = "message/CLEAR_MESSAGES";
const LOAD_ERR = "message/LOAD_ERR";
const CLEAR_ERR = "message/CLEAR_ERR";
const LOAD_MSG = "message/LOAD_MSG";
const CLEAR_MSG = "message/CLEAR_MSG";


const loadMessages = (messages) => ({
    type: LOAD_MESSAGES,
    messages
});

export const clearMessages = () => ({ type: CLEAR_MESSAGES });

const loadErr = (err) => ({
    type: LOAD_ERR,
    err
});

export const clearErr = () => ({ type: CLEAR_ERR });

const loadMsg = (msg) => ({
    type: LOAD_MSG,
    msg
});

export const clearMsg = () => ({ type: CLEAR_MSG });


export const getMessages = (circleId) => async (dispatch) => {
    const response = await csrfFetch(`/api/circles/${circleId}/messages`).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();

        dispatch(loadMessages(data.messages));
    }


    return response;
}


export const createMessage = (circleId, message) => async (dispatch) =>{
    const response = await csrfFetch(`/api/circles/${circleId}/messages`, {
        method: 'POST',
        body: JSON.stringify({message})
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });


    if (response && response.ok) {
        dispatch(loadMsg('Message Created'));
    }

    return response;
}


export const editMessage = (id, message) => async (dispatch) =>{
    const response = csrfFetch(`/api/messages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(message)
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });


    if (response && response.ok) {
        dispatch(loadMsg('Message Updated'));
    }

    return response;
}

export const deleteMessage = (id) => async (dispatch) =>{
    const response = csrfFetch(`/api/messages/${id}`, {
        method: 'DELETE'
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });


    if (response && response.ok) {
        dispatch(loadMsg('Message Deleted'));
    }

    return response;
}


//selectors
export const selMessages = (state) => state.message.messages;
export const selMsg = (state) => state.message.msg;
export const selErr = (state) => state.message.err;


const initialState = { messages: null, msg: null, err: null };

const messagesReducer = (state=initialState, action) => {
    let mutState = Object.assign(state);

    switch (action.type) {
        case LOAD_MESSAGES:
            return {...mutState, messages: action.messages};

        case CLEAR_MESSAGES:
            return {...mutState, messages: null};

        case LOAD_MSG:
            return {...mutState, msg: action.msg};

        case CLEAR_MSG:
            return {...mutState, msg: null};

        case LOAD_ERR:
            return {...mutState, err: action.err};

        case CLEAR_ERR:
            return {...mutState, err: null};

        default:
            return {...mutState};
    }
}

export default messagesReducer;
