import { csrfFetch } from './csrf';



const LOAD_BOOK = 'book/LOAD_BOOK';
const LOAD_BOOKS = 'book/LOAD_BOOKS';
const CLEAR_BOOK = 'book/CLEAR_BOOK';
const CLEAR_BOOKS = 'book/CLEAR_BOOKS';
const LOAD_ERR = 'book/LOAD_ERR';
const CLEAR_ERR = 'book/CLEAR_ERR';
const LOAD_MSG = 'book/LOAD_MSG';
const CLEAR_MSG = 'book/CLEAR_MSG';


const loadBooks = (books) => ({
    type: LOAD_BOOKS,
    books
});

const loadBook = (book) => ({
    type: LOAD_BOOK,
    book
});

const loadErr = (err) => ({
    type: LOAD_ERR,
    err
});

const loadMsg = (msg) => ({
    type: LOAD_MSG,
    msg
});

const clearErr = () => ({ type: CLEAR_ERR });

export const clearBooks = () => ({ type: CLEAR_BOOKS });

export const clearBook = () => ({ type: CLEAR_BOOK });

const clearMsg = () => ({ type: CLEAR_MSG });


export const getBooks = ({ author, title }) => async (dispatch) => {
    let url = '/api/books';


    if (author || title) {
        const queryParams = new URLSearchParams();

        if (author)
            queryParams.append('author', author);

        if (title)
            queryParams.append('title', title);

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
        dispatch(clearErr());
        dispatch(clearMsg());
        dispatch(loadBooks(data));
    }

    return response;
}


//get book by id
export const getBook = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/books/${id}`).catch(async (res) => {
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
        dispatch(loadBook(data.book));
    }

    return response;
}


//create a book
export const createBook = (book) => async (dispatch) => {
    const response = await csrfFetch('/api/books', {
        method: 'POST',
        body: JSON.stringify(book)
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
        dispatch(clearMsg());
        dispatch(loadBook(data.book));
    }

    return response;
}


//edit a book
export const editBook = ({book, id}) => async (dispatch) => {
    const response = await csrfFetch(`/api/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(book)
    }).catch( async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            const err = Object.values(data.errors);
            dispatch(loadErr(err));
        }
    });


    if (response && response.ok) {
        const data = await response.json();
        dispatch(getBook(id));
    }

    return response;
}


//delete a book
export const deleteBook = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/books/${id}`, {
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

        if (data === 'successful') {
            dispatch(clearBook());
        }
    }

    return response;
}

//selectors
const selBooks = (state) => state.book.list;
const selBook = (state) => state.book.details;
const selErr = (state) => state.book.errors;


const initialState = { list: null, details: null, errors: null, message: null };


const booksReducer = (state=initialState, action) => {
    let mutState = Object.assign(state);

    switch (action.type) {
        case LOAD_BOOKS:
            return {...mutState, list: action.books};

        case LOAD_BOOK:
            return {...mutState, details: action.book};

        case LOAD_ERR:
            return {...mutState, errors: action.err};

        case CLEAR_ERR:
            return {...mutState, errors: null};

        case CLEAR_BOOK:
            return {...mutState, details: null};

        case CLEAR_BOOKS:
            return {...mutState, list: null};

        case LOAD_MSG:
            return {...mutState, message: action.msg};

        case CLEAR_MSG:
            return {...mutState, message: null};

        default:
            return mutState;
    }
}


export default booksReducer;
