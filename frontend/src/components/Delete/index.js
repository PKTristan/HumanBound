// /frontend/src/components/Delete/index.js

import { useDispatch, useSelector } from "react-redux";
import * as approvalActions from "../../store/approval";
import * as bookActions from "../../store/book";
import * as userActions from "../../store/user";
import * as reviewActions from "../../store/review";
import * as replyActions from "../../store/reply";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { isValidUrl } from "../BookForm";


const Delete = ({ params: { itemName, id }, setIsOpen }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const bookErr = useSelector(bookActions.selErr);
    const appErr = useSelector(approvalActions.selErr);
    const bookMsg = useSelector(bookActions.selMsg);
    const appMsg = useSelector(approvalActions.selMsg);
    const user = useSelector(userActions.selUser);
    const book = useSelector(bookActions.selBook);
    const replyErr = useSelector(replyActions.selErr);
    const replyMsg = useSelector(replyActions.selMsg);
    const reviewErr = useSelector(reviewActions.selErr);
    const reviewMsg = useSelector(reviewActions.selMsg);

    const [reason, setReason] = useState('');
    const [errors, setErrors] = useState([]);

    const handleYes = (e) => {
        e.preventDefault();

        if (itemName === 'book') {
            let mutBook = book ? {
                bookId: book.id,
                title: book.title,
                subtitle: book.subtitle,
                authors: book.authors,
                publishYear: book.publishYear,
                pageCount: book.pageCount,
                synopsis: book.synopsis,
                thumbnail: book.thumbnail,
                reason: 'DELETE' + reason
            } : {};

            if (book.pdfLink && isValidUrl(book.pdfLink)) {
                mutBook.pdfLink = book.pdfLink;
            }


            if (user && user.admin) {
                dispatch(bookActions.deleteBook(id));
            }
            else {
                dispatch(approvalActions.requestApproval(mutBook));
            }
        }
        else if (itemName === 'reply') {
            dispatch(replyActions.deleteReply(id));
        }
        else if (itemName === 'review') {
            dispatch(reviewActions.deleteReview(id));
        }

    };

    const handleNo = (e) => {
        e.preventDefault();
        setIsOpen(false);
    };

    const handleChange = (e) => {
        e.preventDefault();
        setReason(e.target.value);
    }

    useEffect(() => {
        if (bookErr && bookErr.length) {
            setErrors(bookErr);
        }

        if (appErr && appErr.length) {
            setErrors(appErr);
        }

        if (reviewErr && reviewErr.length) {
            setErrors(reviewErr);
        }

        if (replyErr && replyErr.length) {
            setErrors(replyErr);
        }
    }, [bookErr, appErr, reviewErr, replyErr, setErrors]);

    useEffect(() => {
        if (bookMsg && bookMsg.length) {
            setIsOpen(false);
            alert(bookMsg);
            dispatch(bookActions.clearMsg());
        }

        if (appMsg && appMsg.length) {
            setIsOpen(false);
            alert(appMsg);
            dispatch(approvalActions.clearMsg());
        }

        if (reviewMsg && reviewMsg.length) {
            setIsOpen(false);
        }

        if (replyMsg && replyMsg.length) {
            setIsOpen(false);
        }
    }, [bookMsg, appMsg, reviewMsg, replyMsg, history]);


    return (
        <div className='delete-container'>
            <h1>Confirm Delete</h1>
            {
                book && user &&
                (<>
                    <p>Are you sure you want to remove this {itemName}?</p>
                    <ul>
                        {errors.map(err => <li key={err}>{err}</li>)}
                    </ul>
                    <input type="text" className="reason" value={reason} placeholder="Reason for deleting" onChange={handleChange} />
                    <button className='yes-delete' onClick={handleYes}>Yes (Delete {itemName})</button>
                    <button className='no-delete' onClick={handleNo}>No (Keep {itemName})</button>

                </>)
            }

            {
                (itemName === 'reply' || itemName === 'review') && (
                    <>
                        <p>Are you sure you want to remove this {itemName}?</p>
                        <button className='yes-delete' onClick={handleYes}>Yes (Delete {itemName})</button>
                        <button className='no-delete' onClick={handleNo}>No (Keep {itemName})</button>

                    </>
                )
            }
        </div>
    );
};

export default Delete;
