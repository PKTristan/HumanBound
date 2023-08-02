import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/review';
import * as replyActions from '../../store/reply';
import * as userActions from '../../store/user';
import InterimModal from '../Modal';
import Delete from '../Delete';
import { NavLink, useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import './Review.css';



const Review = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();
    const replyTextareaRefs = useRef([]);
    const reviewTextareaRef = useRef(null);
    const newReplyTextareaRef = useRef(null);
    const user = useSelector(userActions.selUser);
    const review = useSelector(reviewActions.selReview);
    const reviewErr = useSelector(reviewActions.selErr);
    const reviewMsg = useSelector(reviewActions.selMsg);
    const replyErr = useSelector(replyActions.selErr);
    const replyMsg = useSelector(replyActions.selMsg);

    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [editReview, setEditReview] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    const [elementFocused, setElementFocused] = useState(null);


    const handleDown = (idx) => (e) => {
        let mutArr = Array.from(replies);

        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                if (idx !== null) {
                    mutArr[idx].reply = mutArr[idx].reply + '\n';
                    setReplies(mutArr);
                }
                else {
                    setNewReply(`${newReply}\n`);
                }
            }
            else {
                if (idx !== null) {
                    if (mutArr[idx].reply.length > 9) replyTextareaRefs.current[idx].current.blur();
                    dispatch(replyActions.editReply(mutArr[idx].id, mutArr[idx].reply));
                }
                else {
                    if (newReply.length > 9) newReplyTextareaRef.current.blur();
                    dispatch(replyActions.createReply(newReply, review.id));
                    setNewReply('');
                }
            }
        }
    }

    const handleDownReview =(e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                setEditReview(`${editReview}\n`);
            }
            else {
                if (editReview.length > 9) reviewTextareaRef.current.blur();
                dispatch(reviewActions.updateReview({id: review.id, review: editReview}));
                dispatch(reviewActions.clearErr());
            }
        }
        else if (e.key === 'Backspace') {
            e.preventDefault();
            setEditReview(editReview.slice(0, -1));
        }
        else if (e.key.length === 1) {
            e.preventDefault();

            setEditReview(`${editReview}${e.key}`);

        }
    }

    useEffect(() => {
        if (reviewErr && reviewErr[0] === 'No review found') {
            dispatch(reviewActions.clearErr());
            history.goBack();
        }

        if (reviewMsg && reviewMsg.deleted === 'successfully deleted') {
            dispatch(reviewActions.clearMsg());
            history.goBack();
        }
    }, [reviewErr, history, reviewMsg]);

    useEffect(() => {
        if (review && review.Replies) {
            setReplies(review.Replies);
            setEditReview(review.review);
            replyTextareaRefs.current = new Array(review.Replies.length)
                .fill(null)
                .map(() => React.createRef());
        }
    }, [review, setReplies]);

    useEffect(() => {
        if (replyMsg) {
            dispatch(replyActions.clearMsg());
        }

        dispatch(reviewActions.getReview(id));
    }, [id, replyMsg]);


    const onEnter = (elId) => (e) => {
        e.preventDefault();
        setElementFocused(elId);
        setIsHovering(true);
    };

    const onLeave = (e) => {
        e.preventDefault();
        setElementFocused(null);
        setIsHovering(false);
    };

    const isHidden = (elId) => {
        return !((isHovering) && (elId === elementFocused));
    };

    const clearReplyErr = () => dispatch(replyActions.clearErr());
    const resetEdit = (e) => {
        if (review && review.Replies) {
            setReplies(review.Replies);
            setEditReview(review.review);
        }
    };

    const handleChange = (idx) => (e) => {
        e.preventDefault();

        if (idx !== null) {
            let mutArr = Array.from(replies);
            mutArr[idx].reply = e.target.value;

            setReplies(mutArr);
        }
        else {
            setNewReply(e.target.value);
        }
    }


    return (
        <div className="review-wrapper">
            {
                (replyErr) ? (
                    <InterimModal
                        Component={() => (<li>{replyErr}</li>)}
                        isHidden={true}
                        setOpen={true}
                        onClose={[clearReplyErr]}
                    />
                ) : null
            }
            {review && (
                <div className="review">
                    <NavLink to={`/books/${review.bookId}`}>Back</NavLink>
                    <img src={review.User.avi} alt={review.User.username} />
                    <h3>@{review.User.username}</h3>
                    {(user && (user.id === review.userId || user.admin)) ? (
                        <div className='review-edit' onMouseEnter={onEnter(review.id * -1)} onMouseLeave={onLeave}>
                            {
                                reviewErr ? (<li>{reviewErr}</li>) : null
                            }
                            <textarea
                                onBlur={resetEdit}
                                ref={reviewTextareaRef}
                                className={'editReview'}
                                value={editReview}
                                onKeyDown={handleDownReview}
                                onChange={(e) => e.preventDefault()}
                            />
                            <InterimModal Component={Delete} btnClass={'review-delete'} isHidden={isHidden(review.id * -1)} btnLabel='Delete' params={{ id: review.id, itemName: 'review' }} />
                        </div>
                    ) : (
                        <p>{review.review}</p>
                    )}
                    <textarea
                        ref={newReplyTextareaRef}
                        className='newReply'
                        placeholder='Add a reply. (Press enter to update, and shift + enter to add new line.)'
                        value={newReply}
                        onKeyDown={handleDown(null)}
                        onChange={handleChange(null)}
                    />
                </div>
            )}

            {(replies.length) ?
                replies.map((reply, idx) => (
                    <div key={reply.id} className="reply" onMouseEnter={onEnter(reply.id)} onMouseLeave={onLeave} >
                        <img src={reply.User.avi} alt={reply.User.username} />
                        <h4>@{reply.User.username}</h4>
                        {(user && (user.id === reply.userId || user.admin)) ? (
                            <div className='reply-edit'>
                                <textarea
                                    onBlur={resetEdit}
                                    ref={replyTextareaRefs.current[idx]}
                                    className={'editReply'}
                                    value={reply.reply}
                                    onKeyDown={handleDown(idx)}
                                    onChange={handleChange(idx)}
                                />
                                <InterimModal Component={Delete} btnClass={'reply-delete'} isHidden={isHidden(reply.id)} btnLabel='Delete' params={{ id: reply.id, itemName: 'reply' }} />
                            </div>
                        ) : (
                            <p>{reply.reply}</p>
                        )}
                    </div>
                ))
                : null}
        </div>
    )
}

export default Review;
