//Book form

import { useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as approvalActions from '../../store/approval';
import * as bookActions from '../../store/book';
import * as userActions from '../../store/user';

export { isValidUrl } from '../../helpers';


const BookForm = ({params: {ref, isEdit, book: info}, setIsOpen}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(userActions.selUser);
    const book = useSelector(bookActions.selBook);
    const appErr = useSelector(approvalActions.selErr);
    const bookErr = useSelector(bookActions.selErr);
    const appMsg = useSelector(approvalActions.selMsg);

    const [title, setTitle] = useState(info ? info.title : '');
    const [subtitle, setSubtitle] = useState(info ? info.subtitle : '');
    const [authors, setAuthors] = useState(info ? info.authors.join(', ') : '');
    const [pdfLink, setPdfLink] = useState(info ? info.pdfLink || '' : '');
    const [thumbnail, setThumbnail] = useState(info ? info.thumbnail || '' : '');
    const [pageCount, setPageCount] = useState(info ? info.pageCount : 0);
    const [publishYear, setPublishYear] = useState(info ? info.publishYear : 1000);
    const [synopsis, setSynopsis] = useState(info ? info.synopsis : '');
    const [reason, setReason] = useState('');
    const [googleBooks, setGoogleBooks] = useState([]);
    const [errors, setErrors] = useState([]);



    const handleSubmit =(e) => {
        e.preventDefault();

        let auth = authors.split(',');
        auth.forEach(author => author.trim());
        if (auth[0] === '') {
            auth = [];
        };


        let newBook = {
            title,
            subtitle,
            authors: auth,
            pageCount,
            publishYear,
            synopsis
        };

        if (pdfLink.length > 0) {
            newBook.pdfLink = pdfLink;
        }

        if (thumbnail.length > 0) {
            newBook.thumbnail = thumbnail;
        }


        if (isEdit) {
            if (user.admin) {
                dispatch(bookActions.editBook({newBook, id: book.id}));
            }
            else {
                newBook.reason = 'EDIT' + reason;
                newBook.bookId = book.id;
                dispatch(approvalActions.requestApproval(newBook));
            }
        }
        else {
            dispatch(bookActions.createBook(newBook));
        }
    };

    const handleChange = (e) => {
        e.preventDefault();

        const { className, value } = e.target;

        let mutErr = errors;


        switch(className) {
            case "title":
                setTitle(value);
                searchBook();

                if (value.length > 50) {
                    mutErr = mutErr.filter(err => err !== "Please provide a title of max 50 characters.");
                }
                break;

            case "subtitle":
                setSubtitle(value);
                break;

            case "authors":
                setAuthors(value);
                searchBook();

                if (value.length) {
                    mutErr = mutErr.filter(err => err !== "Please provide 1 or multiple authors.");
                }
                break;

            case "pdfLink":
                setPdfLink(value);
                break;

            case "thumbnail":
                setThumbnail(value);
                break;

            case "pageCount":
                setPageCount(value);
                break;

            case 'publishYear':
                setPublishYear(value);
                break;

            case 'synopsis':
                setSynopsis(value);

                if (value.length > 20) {
                    mutErr = mutErr.filter(err => err !== "Please provide a synopsis/summary of at least 20 words long.");
                }
                break;

            case 'reason':
                setReason(value);
                break;

            default:
                break;
        }


        setErrors(mutErr);
    }

    const searchBook = async () => {
        const noCommas = authors.split(',').join('+');
        const authWithPlus = noCommas.split(' ').join('+');
        const titleWithPlus = title.split(' ').join('+');

        const googlyBookys = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${titleWithPlus}+inauthor:${authWithPlus}`);

        const data = await googlyBookys.json();

        if (data.totalItems) {
            setGoogleBooks(data.items);
        }
    };

    const handleClick = (book) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        // get all attributes needed
        const {
            title: bookTitle,
            subtitle: bookSubtitle,
            authors: bookAuthors,
            pageCount: bookPageCount,
            description: bookSynopsis,
            imageLinks: bookImageLinks,
            publishedDates: bookPublishYear
        } = book.volumeInfo;

        let bookPDFLink = false;
        let isAvailable = false;
        let acsTokenLink = false;

        if (book.accessInfo.pdf) {
            isAvailable = book.accessInfo.pdf;
            acsTokenLink = book.accessInfo.pdf.acsTokenLink;
        }

        //get the link for pdf
        if (isAvailable && acsTokenLink) {
            bookPDFLink = acsTokenLink;
        }

        //set authors
        if (Array.isArray(bookAuthors))
            setAuthors(bookAuthors.join(', '));
        else
            console.log(bookAuthors);

        //set publish year
        if (typeof bookPublishYear === 'string') {
            setPublishYear(bookPublishYear.substring(0, 4));
        }
        else {
            console.log(bookPublishYear);
        }


        //set the rest
        setTitle(bookTitle);
        setSubtitle(bookSubtitle ? bookSubtitle : '');
        setPageCount(bookPageCount);
        setSynopsis(bookSynopsis);
        setPdfLink(bookPDFLink ? bookPDFLink : '');
        setThumbnail(bookImageLinks ? bookImageLinks.thumbnail : '');
        setSynopsis(bookSynopsis);
        setGoogleBooks([]);
    }

    useEffect(() => {
        if (!(title.length > 0) && !(authors.length > 0) && (googleBooks.length > 0)) {
            setGoogleBooks([]);
        }
    }, [googleBooks, setGoogleBooks]);

    useEffect(() => {
        if (bookErr) {
            setErrors(bookErr);
        }

        if (appErr) {
            setErrors(appErr);
        }
    }, [bookErr, appErr, setErrors]);

    useEffect(() => {
        if (book) {
            const {id} = book;
            history.push(`/books/${id}`);
        }
    }, [book]);

    useEffect(() => {
        if (appMsg) {
            alert(appMsg);
            setIsOpen(false);
            dispatch(approvalActions.clearMsg());
        }
    }, [appMsg]);

    return (
        <div className='book-form-wrapper' ref={ref}>
            <h1>{(isEdit) ? "Notice a discrepency?" : "Add a Book to Our Library!"}</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {(errors && errors.length) ? errors.map((error, i) => (<li key={i}>{error}</li>)) : null}
                </ul>
                <input type="text" className="title" placeholder="Title" onChange={handleChange} value={title} />
                <input type='text' className='subtitle' placeholder='Subtitle' onChange={handleChange} value={subtitle} />
                <input type='text' className='authors' placeholder='Authors: separated by commas' onChange={handleChange} value={authors} />
                <input type='url' className='pdfLink' placeholder='Link to PDF' onChange={handleChange} value={pdfLink} />
                <input type='url' className='thumbnail' placeholder='Book Cover Image URL' onChange={handleChange} value={thumbnail} />
                <input type='number'  className='pageCount' placeholder='Page Count' onChange={handleChange} value={pageCount} />
                <input type='number' className='publishYear' placeholder='Publish Year' onChange={handleChange} value={publishYear} />
                <textarea className='synopsis' placeholder='Synopsis' onChange={handleChange} value={synopsis} />
                {
                    (isEdit) &&
                    (<input type='text' className='reason' placeholder='Reason for Change' onChange={handleChange} value={reason} />)
                }
                <button type='submit' className='submit-btn'>Submit</button>

                {(googleBooks.length > 0) &&
                    (
                        <div className='google-books'>
                            {googleBooks.map(book => (
                                <div key={book.id} onClick={handleClick(book)}>
                                    <img src={book.volumeInfo.imageLinks && ((book.volumeInfo.imageLinks.smallThumbnail) || (book.volumeInfo.imageLinks.thumbnail))} alt="book" />
                                    <h5>{book.volumeInfo.title}</h5>
                                    <p>{(Array.isArray(book.volumeInfo.authors)) ? book.volumeInfo.authors.join(', ') : book.volumeInfo.authors}</p>
                                </div>
                            ))}
                        </div>
                    )
                }
            </form>
        </div>
    )
}

export default BookForm;
