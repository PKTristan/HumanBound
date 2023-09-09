import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { setDefaultImg } from "../../helpers";
import './BookCard.css';

const BookCard = ({books, customClick=null }) => {
    const history = useHistory();

    const handleClick = (id) => (e) => {
        e.preventDefault();

        history.push(`/books/${id}`);
    };

    return (
        <div className='books-list' >
            {books.length > 0 ? books.map(book => (
                <div className="book-card" onClick={customClick ? customClick(book) : handleClick(book.id)} key={book.id}>
                    <img src={book.thumbnail} alt={book.title} onError={setDefaultImg} />
                    <h4 className="book-title">{book.title}</h4>
                    <h5 className="book-author">by {(book.authors && Array.isArray(book.authors)) ? book.authors.join(', ') : book.authors}</h5>
                    <p className="book-description">{book.synopsis}</p>
                </div>
            )) : <h1>Hmm, it seems we ran out of books...</h1>}
        </div>
    )
}

export default BookCard;
