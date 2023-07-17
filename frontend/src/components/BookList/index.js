import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bookActions from "../../store/book";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const BookList = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const list = useSelector(bookActions.selBooks);

    const [books, setBooks] = useState([]);
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');


    const handleClick = (id) => (e) => {
        e.preventDefault();

        history.push(`/books/${id}`);
    };

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
        <div className="book-list" >
            <input type='text' className='title' placeholder="Search by title" onChange={handleChange} value={title} />
            <input type='text' className='author' placeholder="Search by author" onChange={handleChange} value={author} />

            {books.length > 0 ? books.map(book => (
                <div className="book-card" onClick={handleClick(book.id)} key={book.id}>
                    <img src={book.thumbnail} alt={book.title} />
                    <h4 className="book-title">{book.title}</h4>
                    <p className="book-author">{book.authors}</p>
                    <p className="book-description">{book.synopsis}</p>
                </div>
            )) : null}
        </div>
    )
}

export default BookList;
