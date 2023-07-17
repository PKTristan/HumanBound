import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import * as bookActions from "../../store/book";
import * as userActions from "../../store/user";
import InterimModal from "../Modal";
import BookForm from "../BookForm";
import Delete from "../Delete";


const BookDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const book = useSelector(bookActions.selBook);
    const user = useSelector(userActions.selUser);

    const [isModal, setIsModal] = useState(false);


    useEffect(() => {
        dispatch(bookActions.getBook(id));

        return () => {
            if (!isModal) {
                dispatch(bookActions.clearBook());
            }
        }
    }, [dispatch, id]);


    return book ? (
        <div className='book-details'>
            <div className="book-details-nav">
                <NavLink to="/books">Back</NavLink>
                {
                    user ? (
                        <>
                            <div className="interim-modal" onMouseEnter={() => setIsModal(true)} onMouseLeave={() => setIsModal(false)}>
                                <InterimModal Component={BookForm} btnClass={'btn-details'} btnLabel={'Edit'} params={{ ref: null, isEdit: true, book }} />
                                <InterimModal Component={Delete} btnClass={'btn-details'} btnLabel={'Delete'} params={{ id: book.id, itemName: 'book' }} />
                            </div>
                        </>
                    ) : null
                }
            </div>
            <div className="top-half" >
                <div className="thumbnail"><img src={book.thumbnail} alt={book.title} /></div>
                <div className="details" >
                    <h1>{book.title}</h1>
                    <h2>{book.subtitle}</h2>
                    <h4>by {book.authors.join(', ')}</h4>
                    <p>{book.publishYear}</p>
                    <p>{book.pageCount}</p>
                </div>
            </div>
            <div className="bottom-half">
                <div className="synopsis">
                    <h3>Description:</h3>
                    <p>{book.synopsis}</p>
                </div>
                <div className="reviews">
                    <h3>Reviews:</h3>
                    {book.Reviews.map(review => (
                        <div key={review.id} className="review">
                            <h5>@{review.User.username}</h5>
                            <p>{review.review}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) : null;
}

export default BookDetails;
