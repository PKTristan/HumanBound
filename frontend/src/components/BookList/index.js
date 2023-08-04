import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bookActions from "../../store/book";
import './BookList.css';
import BookCard from "../BookCards";

const BookList = () => {
    const dispatch = useDispatch();
    const list = useSelector(bookActions.selBooks);

    const [books, setBooks] = useState([]);
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');

    const handleChange = (e) => {
        e.preventDefault();

        const { className, value } = e.target;

        switch(className) {
            case "title":
                setTitle(value);
                break;

            case "author":
                setAuthor(value);
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        dispatch(bookActions.getBooks({}));
        return () => {
            dispatch(bookActions.clearBooks());
        }
    }, [dispatch]);

    useEffect(() => {
        if (list) {
            setBooks(list.books);
        }
    }, [list]);

    useEffect(() => {
        dispatch(bookActions.getBooks({ title: title, author: author }));
    }, [title, author]);


    return (
        <div className="books-page" >
            <input type='text' className='title' placeholder="Search by title" onChange={handleChange} value={title} />
            <input type='text' className='author' placeholder="Search by author" onChange={handleChange} value={author} />

            <BookCard books={books} />
        </div>
    )
}

export default BookList;
