// /frontend/src/components/Delete/index.js

import { useDispatch, useSelector } from "react-redux";
import * as bookActions from "../../store/book";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";


const Delete = ({ params: { itemName, id }, setIsOpen }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const err = useSelector(bookActions.selErr);
    const msg = useSelector(bookActions.selMsg);

    const handleYes = (e) => {
        e.preventDefault();

        if (itemName === 'book') {
            dispatch(bookActions.deleteBook(id));
        }

    };

    const handleNo = (e) => {
        e.preventDefault();
        setIsOpen(false);
    };

    useEffect(() => {
        if (err && err.length) {
            setIsOpen(false);
            alert(err);
        }
    }, [err]);

    useEffect(() => {
        if (msg && msg.length) {
            history.push(`/${itemName}s`);
        }
    })


    return (
        <div className='delete-container'>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this {itemName}?</p>
            <button className='yes-delete' onClick={handleYes}>Yes (Delete {itemName})</button>
            <button className='no-delete' onClick={handleNo}>No (Keep {itemName})</button>

        </div>
    );
};

export default Delete;
