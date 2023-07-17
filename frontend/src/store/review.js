import { csrfFetch } from "./csrf";


const LOAD_REVIEW = 'review/LOAD_REVIEW';
const CLEAR_REVIEW = 'review/CLEAR_REVIEW';
const LOAD_ERR = 'review/LOAD_ERR';
const CLEAR_ERR = 'review/CLEAR_ERR';
const LOAD_MSG = 'review/LOAD_MSG';
const CLEAR_MSG = 'review/CLEAR_MSG';


const loadReview = (review) => ({
    type: LOAD_REVIEW,
    review
});

const clearReview = () => ({ type: CLEAR_REVIEW });

const loadErr = (err) => ({
    type: LOAD_ERR,
    err
});

const clearErr = () => ({ type: CLEAR_ERR });

const loadMsg = (msg) => ({
    type: LOAD_MSG,
    msg
});

export const clearMsg = () => ({ type: CLEAR_MSG });


export const getReview = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${id}`).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();
        dispatch(loadReview(data.review));
    }

    return response;
}

export const createReview = (review) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews`, {
        method: 'POST',
        body: JSON.stringify(review)
    }).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        const data = await response.json();
        dispatch(loadReview(data));
    }

    return response;
}

export const updateReview = (review) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        body: JSON.stringify(review)
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

export const deleteReview = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${id}`, {
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
        dispatch(clearReview());
        dispatch(loadMsg(data));
    }

    return response;
}

// selectors
export const selReview = (state) => state.review.details;
export const selErr = (state) => state.review.error;
export const selMsg = (state) => state.review.message;


const initialState = { details: null, error: null, message: null };

const reviewsReducer = (state = initialState, action) => {
    let mutState = Object.assign(state);

    switch (action.type) {
        case LOAD_REVIEW:
            return { ...mutState, details: action.review };

        case LOAD_ERR:
            return { ...mutState, error: action.err };

        case LOAD_MSG:
            return { ...mutState, message: action.msg };

        case CLEAR_REVIEW:
            return { ...mutState, details: null };

        case CLEAR_ERR:
            return { ...mutState, error: null };

        case CLEAR_MSG:
            return { ...mutState, message: null };

        default:
            return mutState;
    }
}

export default reviewsReducer;
