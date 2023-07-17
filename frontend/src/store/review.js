import { csrfFetch } from "./csrf";


const LOAD_REVIEW = 'review/LOAD_REVIEW';
const CLEAR_REVIEW = 'review/CLEAR_REVIEW';
const LOAD_ERR = 'review/LOAD_ERR';
const CLEAR_ERR = 'review/CLEAR_ERR';


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


export const getReview = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${id}`).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });

    if (response && response.ok) {
        
    }
}
