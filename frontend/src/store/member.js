import { csrfFetch } from "./csrf";


const LOAD_MEMBERS = 'member/LOAD_MEMBERS';
const CLEAR_MEMBERS = 'member/CLEAR_MEMBERS';
const LOAD_MEMBERSHIPS = 'member/LOAD_MEMBERSHIPS';
const CLEAR_MEMBERSHIPS = 'member/CLEAR_MEMBERSHIPS';
const LOAD_ERR = 'member/LOAD_ERR';
const CLEAR_ERR = 'member/CLEAR_ERR';
const LOAD_MSG = 'member/LOAD_MSG';
const CLEAR_MSG = 'member/CLEAR_MSG';

const loadMembers = (members) => ({
    type: LOAD_MEMBERS,
    members
});

export const clearMembers = () => ({
    type: CLEAR_MEMBERS
});

const loadMemberships = (memberships) => ({
    type: LOAD_MEMBERSHIPS,
    memberships
});

export const clearMemberships = () => ({
    type: CLEAR_MEMBERSHIPS
});

const loadErr = (err) => ({
    type: LOAD_ERR,
    err
});

export const clearErr = () => ({
    type: CLEAR_ERR
});

const loadMsg = (msg) => ({
    type: LOAD_MSG,
    msg
});

export const clearMsg = () => ({
    type: CLEAR_MSG
});


export const getMemberships = () => async (dispatch) => {
    const response = await csrfFetch(`/api/members/my`).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();
        dispatch(loadMemberships(data.memberships));
    }

    return response;
}


//selectors
export const selMemberships = (state) => state.member.memberships;
export const selErr = (state) => state.member.err;
export const selMsg = (state) => state.member.msg;


const initialState = {
    memberships: null,
    err: null,
    msg: null
}

const memberReducer = (state=initialState, action) => {
    let mutState = Object.assign(state);

    switch(action.type) {
        case LOAD_MEMBERS:
            return {...mutState, memberships: action.members};

        case CLEAR_MEMBERS:
            return {...mutState, memberships: null};

        case LOAD_MEMBERSHIPS:
            return {...mutState, memberships: action.memberships};

        case CLEAR_MEMBERSHIPS:
            return {...mutState, memberships: null};

        case LOAD_ERR:
            return {...mutState, err: action.err};

        case CLEAR_ERR:
            return {...mutState, err: null};

        case LOAD_MSG:
            return {...mutState, msg: action.msg};

        case CLEAR_MSG:
            return {...mutState, msg: null};

        default:
            return {...mutState};
    }
}

export default memberReducer;
