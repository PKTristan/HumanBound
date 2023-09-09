import { csrfFetch } from "./csrf";

const LOAD_CIRCLES = 'circle/LOAD_CIRCLES';
const CLEAR_CIRCLES = 'circle/CLEAR_CIRCLES';
const LOAD_CIRCLE = 'circle/LOAD_CIRCLE';
const CLEAR_CIRCLE = 'circle/CLEAR_CIRCLE';
const LOAD_ERR = 'circle/LOAD_ERR';
const CLEAR_ERR = 'circle/CLEAR_ERR';
const LOAD_MSG = 'circle/LOAD_MSG';
const CLEAR_MSG = 'circle/CLEAR_MSG';

const loadCircle = (circle) => ({
    type: LOAD_CIRCLE,
    circle
});

export const clearCircle = () => ({
    type: CLEAR_CIRCLE,
});

const loadCircles = (circles) => ({
    type: LOAD_CIRCLES,
    circles
});

export const clearCircles = () => ({
    type: CLEAR_CIRCLES
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
    type: CLEAR_MSG,
});


export const getCircles = ({ name }) => async (dispatch) => {
    let url = '/api/circles';


    if (name) {
        const queryParams = new URLSearchParams();

        if (name)
            queryParams.append('name', name);

        url += `/?${queryParams.toString()}`;
    }

    const response = await csrfFetch(url).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();
        dispatch(loadCircles(data));
    }

    return response;
}

export const getCircle = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/circles/${id}`).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();
        dispatch(loadCircle(data));
    }

    return response;
}

export const createCircle = (circle) => async (dispatch) => {
    const response = await csrfFetch('/api/circles', {
        method: 'POST',
        body: JSON.stringify(circle)
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

        dispatch(loadMsg(data.circle.id));
    }

    return response;
}

export const updateCircle = (circle) => async (dispatch) => {
    const response = await csrfFetch(`/api/circles/${circle.id}`, {
        method: 'PUT',
        body: JSON.stringify(circle)
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();
        dispatch(getCircle(circle.id));
    }

    return response;
}

export const deleteCircle = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/circles/${id}`, {
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
        dispatch(loadMsg(data));
    }

    return response;
}


//selectors

export const selCircles = (state) => state.circle.list;
export const selCircle = (state) => state.circle.details;
export const selMsg = (state) => state.circle.message;
export const selErr = (state) => state.circle.errors;


const initialState = { list: null, details: null, errors: null, message: null };


const circlesReducer = (state=initialState, action) => {
    let mutState = Object.assign(state);

    switch(action.type) {
        case LOAD_CIRCLES:
            return {...mutState, list: action.circles};

        case LOAD_CIRCLE:
            return {...mutState, details: action.circle};

        case LOAD_ERR:
            return {...mutState, errors: action.err};

        case CLEAR_ERR:
            return {...mutState, errors: null};

        case CLEAR_CIRCLE:
            return {...mutState, details: null};

        case CLEAR_CIRCLES:
            return {...mutState, list: null};

        case LOAD_MSG:
            return {...mutState, message: action.msg};

        case CLEAR_MSG:
            return {...mutState, message: null};

        default:
            return {...mutState};
    }
}


export default circlesReducer;
