import {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../store/review';


const Review = () => {
    const dispatch = useDispatch();
    const review = useSelector(reviewActions.selReview);
    const err = useSelector(reviewActions.selErr);
    const msg = useSelector(reviewActions.selMsg);

    return (
        <div className="review">

        </div>
    )
}

export default Review;
