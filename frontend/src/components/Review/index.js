import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/review';
import * as replyActions from '../../store/reply';
import * as userActions from '../../store/user';
import InterimModal from '../Modal';
import Delete from '../Delete';
import { NavLink, useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';




const Review = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();
    const textareaRef = useRef(null);
    const user = useSelector(userActions.selUser);
    const review = useSelector(reviewActions.selReview);
    const reviewErr = useSelector(reviewActions.selErr);
    const reviewMsg = useSelector(reviewActions.selMsg);
    const replyErr = useSelector(replyActions.selErr);
    const replyMsg = useSelector(replyActions.selMsg);

    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [editReview, setEditReview] = useState('');

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
                    dispatch(replyActions.editReply(mutArr[idx].id, mutArr[idx].reply));
                }
                else {
                    dispatch(replyActions.createReply(newReply, review.id));
                    setNewReply('');
                }
            }
        }
        else if (e.key === 'Backspace') {
            e.preventDefault();
            if (idx !== null) {
                mutArr[idx].reply = mutArr[idx].reply.slice(0, -1);
                setReplies(mutArr);
            }
            else {
                setNewReply(newReply.slice(0, -1));
            }
        }
        else if (e.key.length === 1) {
            e.preventDefault();
            if (idx !== null) {
                mutArr[idx].reply = mutArr[idx].reply + e.key;
                setReplies(mutArr);
            }
            else {
                setNewReply(`${newReply}${e.key}`);
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
        }
    }, [review, setReplies]);

    useEffect(() => {
        if (replyMsg) {
            dispatch(replyActions.clearMsg());
        }

        dispatch(reviewActions.getReview(id));
    }, [id, replyMsg]);

    const clearReplyErr = () => dispatch(replyActions.clearErr());


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
                        <div className='review-edit'>
                            {
                                reviewErr ? (<li>{reviewErr}</li>) : null
                            }
                            <textarea
                                ref={textareaRef}
                                className={'editReview'}
                                value={editReview}
                                onKeyDown={handleDownReview}
                                onChange={(e) => e.preventDefault()}
                            />
                            <InterimModal Component={Delete} btnClass={'review-delete'} btnLabel='Delete' params={{ id: review.id, itemName: 'review' }} />
                        </div>
                    ) : (
                        <p>{review.review}</p>
                    )}
                    <textarea
                        ref={textareaRef}
                        className='newReply'
                        placeholder='Add a reply. (Press enter to update, and shift + enter to add new line.)'
                        value={newReply}
                        onKeyDown={handleDown(null)}
                        onChange={(e) => e.preventDefault()}
                    />
                </div>
            )}

            {(replies.length) ?
                replies.map((reply, idx) => (
                    <div key={reply.id} className="reply">
                        <img src={reply.User.avi} alt={reply.User.username} />
                        <h4>@{reply.User.username}</h4>
                        {(user && (user.id === reply.userId || user.admin)) ? (
                            <div className='reply-edit'>
                                <textarea
                                    ref={textareaRef}
                                    className={'editReply'}
                                    value={reply.reply}
                                    onKeyDown={handleDown(idx)}
                                    onChange={(e) => e.preventDefault()}
                                />
                                <InterimModal Component={Delete} btnClass={'reply-delete'} btnLabel='Delete' params={{ id: reply.id, itemName: 'reply' }} />
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
