import { csrfFetch } from "./csrf";


const LOAD_APP = 'approvals/LOAD_APP';
const CLEAR_APP = 'approvals/CLEAR_APP';
const LOAD_ERR = 'approvals/LOAD_ERR';
const CLEAR_ERR = 'approvals/CLEAR_ERR';
const LOAD_MSG = 'approvals/LOAD_MSG';
const CLEAR_MSG = 'approvals/CLEAR_MSG';


const loadApprovals = (approvals) => ({
    type: LOAD_APP,
    approvals
});

export const clearApprovals = () => ({
    type: CLEAR_APP
});

const loadErr = (err) => ({
    type: LOAD_ERR,
    err
});

const clearErr = () => ({
    type: CLEAR_ERR
});

const loadMsg = (msg) => ({
    type: LOAD_MSG,
    msg
});

export const clearMsg = () => ({ type: CLEAR_MSG });


//get approvals
export const getApprovals = () => async (dispatch) => {
    const response = await csrfFetch('/api/approvals').catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });


    if (response && response.ok) {
        const data = await response.json();
        dispatch(clearErr());
        dispatch(clearMsg());
        dispatch(loadApprovals(data.approvals));
    }

    return response;
};


//create an approval request
export const requestApproval = (approval) => async (dispatch) => {
    const response = await csrfFetch('/api/approvals', {
        method: 'POST',
        body: JSON.stringify(approval)
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });


    if (response && response.ok) {
        const {emails} = await response.json();
        const email = emails.reduce((acc, email) => {
            return `${acc}, ${email}`;
        });
        
        dispatch(loadMsg(`Approval request successful. Check on the book later to see if the changes were made, for further questions please ask an admin: ${email}`));
    }

    return response;
}

//approve an approval request
export const approve = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/approvals/${id}/approve`, {
        method: 'PUT'
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        // const data = await response.json();
        dispatch(loadMsg());
    }

    return response;
}


//deny a request
export const deny = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/approvals/${id}/deny`, {
        method: 'PUT'
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        // const data = await response.json();

        dispatch(loadMsg());
    }
}



///use selectors
export const selApprovals = (state) => state.approval.list;
export const selErr = (state) => state.approval.errors;
export const selMsg = (state) => state.approval.message;


const initialState = {list: null, errors: null, message: null};

const approvalsReducer = (state = initialState, action) => {
    let mutState = Object.assign(state);

    switch(action.type) {
        case LOAD_APP:
            return {...mutState, list: action.approvals};

        case LOAD_ERR:
            return {...mutState, errors: action.err};

        case LOAD_MSG:
            return {...mutState, message: action.msg};

        case CLEAR_APP:
            return {...mutState, list: null};

        case CLEAR_ERR:
            return {...mutState, errors: null};

        case CLEAR_MSG:
            return {...mutState, message: null};

        default:
            return mutState;
    }
}


export default approvalsReducer;
