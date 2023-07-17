import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/review';
import * as replyActions from '../../store/reply';
import * as userActions from '../../store/user';
import InterimModal from '../Modal';
import Delete from '../Delete';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';




const Review = ({ params: { id } }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const textareaRef = useRef(null);
    const user = useSelector(userActions.selUser);
    const review = useSelector(reviewActions.selReview);
    const reviewErr = useSelector(reviewActions.selErr);
    const reviewMsg = useSelector(reviewActions.selMsg);
    const replyErr = useSelector(replyActions.selErr);
    const replyMsg = useSelector(replyActions.selMsg);

    const [replies, setReplies] = useState([]);
    const [replyObj, setReplyObj] = useState({});
    const [newReply, setNewReply] = useState('');
    const [editReview, setEditReview] = useState('');

    const handleDown = (id) => (e) => {
        let mutObj = Object.assign(replyObj);

        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                if (id) {
                    mutObj[id] = mutObj[id] + '\n';
                }
                else {
                    setNewReply(`${newReply}\n`);
                }
            }
            else {
                if (id) {
                    dispatch(replyActions.editReply(id, mutObj[id]));
                }
                else {
                    dispatch(replyActions.createReply(newReply, review.id));
                    setNewReply('');
                }
            }
        }
        else if (e.key === 'Backspace') {
            e.preventDefault();
            if (id) {
                mutObj[id] = mutObj[id].slice(0, -1);
            }
            else {
                setNewReply(newReply.slice(0, -1));
            }
        }
        else if (e.key.length === 1) {
            e.preventDefault();
            if (id) {
                mutObj[id] = mutObj[id] + e.key;
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

    const handleDelete = (id) => (e) => {
        e.preventDefault();
        dispatch(replyActions.deleteReply(id));
    }

    useEffect(() => {
        if (reviewMsg === 'successfully deleted') {
            history.push('/');
        }
        else {
            dispatch(replyActions.clearMsg());
            dispatch(reviewActions.clearMsg());
            dispatch(reviewActions.getReview(id));
        }
    }, [id, replyMsg, reviewMsg]);

    useEffect(() => {
        if (review && review.Replies) {
            setReplies(review.Replies);
            setEditReview(review.review);
        }
    }, [review]);

    useEffect(() => {
        if (replies && replies.length) {
            let mutObj = {};
            replies.forEach(reply => {
                mutObj[reply.id] = reply.reply;
            });

            setReplyObj(mutObj);
        }
    }, [replies]);

    useEffect(() => {
        if (replyErr && replyErr[0] === 'no reply found' || reviewErr && reviewErr[0] === 'No review found') {
            history.push('/');
        }
        else if (reviewErr) {
            alert(reviewErr);
            dispatch(reviewActions.clearMsg());
        }
        else if (replyErr) {
            alert(replyErr);
            dispatch(replyActions.clearMsg());
        }
    }, [reviewErr, replyErr]);


    return (
        <div className="review-wrapper">
            {review && (
                <div className="review">
                    <img src={review.User.avi} alt={review.User.username} />
                    <h3>@{review.User.username}</h3>
                    {(user && (user.id === review.userId || user.admin)) ? (
                        <div className='review-edit'>
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
                replies.map((reply) => (
                    <div key={reply.id} className="reply">
                        <img src={reply.User.avi} alt={reply.User.username} />
                        <h4>@{reply.User.username}</h4>
                        {(user && (user.id === reply.userId || user.admin)) ? (
                            <div className='reply-edit'>
                                <textarea
                                    ref={textareaRef}
                                    className={'editReply'}
                                    value={replyObj[reply.id]}
                                    onKeyDown={handleDown(reply.id)}
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
