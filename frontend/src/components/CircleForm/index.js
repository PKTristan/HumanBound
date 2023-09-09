import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import * as bookActions from "../../store/book";
import * as circleActions from "../../store/circle";
import BookCard from "../BookCards";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CircleForm = ({params: {ref, setDropdown}, setIsOpen}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const booksList = useSelector(bookActions.selBooks);
    const circleErr = useSelector(circleActions.selErr);
    const circleMsg = useSelector(circleActions.selMsg);

    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [books, setBooks] = useState([]);
    const [currentBook, setCurrentBook] = useState(null);
    const [errors, setErrors] = useState([]);


    useEffect(() => {
        dispatch(bookActions.getBooks({ title, author }));
    }, [title, author]);

    useEffect(() => {
        if (booksList && Array.isArray(booksList.books)) {
            setBooks(booksList.books);
        }
        else {
            console.log(booksList);
        }
    }, [booksList]);


    useEffect(() => {
        if (circleErr && Array.isArray(circleErr)) {
            setErrors(circleErr);
        }
    }, [circleErr]);

    useEffect(() => {
        if (circleMsg) {
            const id = circleMsg;
            dispatch(circleActions.clearMsg());
            setIsOpen(false);
            if (setDropdown) {
                setDropdown(false);
            }
            history.push(`/circles/${id}`);
        }
    })

    const handleChange = (e) => {
        e.preventDefault();

        const { className, value } = e.target;

        switch (className) {
            case "name":
                setName(value);
                break;

            case "author":
                setAuthor(value);
                break;

            case "title":
                setTitle(value);
                break;

            default:
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(circleActions.createCircle({ name, currentBook }));
    }

    const handleClick = (book) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        setCurrentBook(book.id);
        setTitle(book.title);
        setAuthor((book.authors && Array.isArray(book.authors)) ? book.authors.join(', ') : book.authors);
    }

    return (
        <div className='circle-form-wrapper' ref={ref}>
            <h1>Create Your Own Circle!</h1>
            <ul hidden={!(errors && errors.length)}>
                {(errors && errors.length) ? errors.map((error, i) => (<li key={i}>{error}</li>)) : null}
            </ul>
            <form className='circle-form' onSubmit={handleSubmit}>
                <input type="text" placeholder='Circle Name' className="name" value={name} onChange={handleChange} />
                <input type="text" placeholder='Title' className="title" value={title} onChange={handleChange} />
                <input type="text" placeholder='Author' className="author" value={author} onChange={handleChange} />
                <div className='books-list'>
                    {(books.length > 0) ? (<BookCard books={books} customClick={handleClick} />) : null}
                </div>
                <button type='submit'>Create Circle</button>
            </form>
        </div>
    )
}

export default CircleForm;
