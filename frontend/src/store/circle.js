import { csrfFetch } from "./csrf";

const LOAD_CIRCLES = 'circle/LOAD_CIRCLES';
const CLEAR_CIRCLES = 'circle/CLEAR_CIRCLES';
const LOAD_CIRCLE = 'circle/LOAD_CIRCLE';
const CLEAR_CIRCLE = 'circle/CLEAR_CIRCLE';
const LOAD_ERR = 'circle/LOAD_CIRCLE';
const CLEAR_ERR = 'circle/CLEAR_ERR';

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
const clearErr = () => ({
    type: CLEAR_ERR
});


export const getCircles = () => async (dispatch) => {
    const response = await csrfFetch('/api/circles').catch(async (res) => {
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
    const response = csrfFetch(`/api/circles/${id}`).catch(async (res) => {
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
        dispatch(loadCircle(data));
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
        dispatch(loadCircle(data));
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
        dispatch(clearCircle());
    }

    return response;
}
