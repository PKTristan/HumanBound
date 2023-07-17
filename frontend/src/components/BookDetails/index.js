import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import * as bookActions from "../../store/book";
import * as userActions from "../../store/user";
import * as reviewActions from "../../store/review";
import InterimModal from "../Modal";
import BookForm from "../BookForm";
import Delete from "../Delete";
import Review from "../Review";


const BookDetails = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();
    const book = useSelector(bookActions.selBook);
    const user = useSelector(userActions.selUser);
    const reviewErr = useSelector(reviewActions.selErr);
    const reviewDet = useSelector(reviewActions.selReview);

    const [isModal, setIsModal] = useState(false);
    const [review, setReview] = useState('');

    const handleDownReview = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                setReview(`${review}\n`);
            }
            else {
                dispatch(reviewActions.createReview(review, book.id));
                setReview('');
            }
        }
        else if (e.key === 'Backspace') {
            e.preventDefault();
            setReview(review.slice(0, -1));
        }
        else if (e.key.length === 1) {
            e.preventDefault();

            setReview(`${review}${e.key}`);
        }
    }

    const handleViewReview = (id) => (e) => {
        e.preventDefault();
        history.push(`/reviews/${id}`);
    }

    useEffect(() => {
        dispatch(bookActions.getBook(id));

        return () => {
            if (!isModal) {
                dispatch(bookActions.clearBook());
            }
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (reviewErr && reviewErr.length) {
            alert(reviewErr);
        }
    }, [reviewErr]);

    useEffect(() => {
        if (reviewDet) {
            dispatch(bookActions.getBook(id));
            dispatch(reviewActions.clearReview());
        }
    }, [reviewDet]);


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
                    <div className="write-review">
                        <textarea value={review} onChange={(e) => e.preventDefault()} onKeyDown={handleDownReview} placeholder="Add a review." />
                    </div>
                    {book.Reviews.map(review => (
                        <div key={review.id} className="review" onClick={handleViewReview(review.id)}>
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
