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
        console.log(e)
        const { className, value } = e.target;

        const name = className.slice(7);

        switch(name) {
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
            <h1>HumanBound Library</h1>

            <input type='text' className='search title' placeholder="Search by title" onChange={handleChange} value={title} />
            <input type='text' className='search author' placeholder="Search by author" onChange={handleChange} value={author} />

            <BookCard books={books} />
        </div>
    )
}

export default BookList;
