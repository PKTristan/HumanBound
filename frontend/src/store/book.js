import { csrfFetch } from './csrf';



const LOAD_BOOK = 'book/LOAD_BOOK';
const LOAD_BOOKS = 'book/LOAD_BOOKS';
const CLEAR_BOOK = 'book/CLEAR_BOOK';
const CLEAR_BOOKS = 'book/CLEAR_BOOKS';
const LOAD_ERR = 'book/LOAD_ERR';
const CLEAR_ERR = 'book/CLEAR_ERR';


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

const clearErr = () => ({ type: CLEAR_ERR });

const clearBooks = () => ({ type: CLEAR_BOOKS });

const cleartBook = () => ({ type: CLEAR_BOOK });


export const getBooks = ({ author, title }) => async (dispatch) => {
    let url = '/api/books';


    if (author || title) {
        const queryParams = new URLSearchParams();

        if (author)
            queryParams.append('author', author);

        if (title)
            queryParams.append('title', title);

        url += `/?${queryParams.toString()}`;
        console.log(url);
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

        dispatch(loadBooks(data));
    }

    return response;
}


//selectors
const selBooks = (state) => state.book.list;


const initialState = { list: null, details: null, errors: null };


const booksReducer = (state=initialState, action) => {
    let mutState = Object.assign(state);

    switch (action.type) {
        case LOAD_BOOKS:
            return {...mutState, list: action.books};

        default:
            return mutState;
    }
}


export default booksReducer;
