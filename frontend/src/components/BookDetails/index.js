import {useSelector, useDispatch } from "react-redux";
import {useHistory, useParams, NavLink} from "react-router-dom";
import { useState, useEffect } from "react";
import * as bookActions from "../../store/book";
import InterimModal from "../Modal";
import BookForm from "../BookForm";


const BookDetails = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {id} = useParams();
    const book = useSelector(bookActions.selBook);


    useEffect(() => {
        dispatch(bookActions.getBook(id));

        return () => {
            dispatch(bookActions.clearBook());
        }
    }, [dispatch, id]);


    return book ? (
        <div className='book-details'>
            <div className="book-details-nav">
                <NavLink to="/books">Back</NavLink>
                <InterimModal Component={BookForm} btnClass={'btn-details'} btnLabel={'Edit'} params={{ ref: null, isEdit: true, book }} />
                <button type="button" className="btn-details">Delete</button>
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
    ) :  null;
}

export default BookDetails;
