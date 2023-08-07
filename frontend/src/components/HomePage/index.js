import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import * as userActions from '../../store/user';
import * as bookActions from '../../store/book';
import readingFigures from '../../assets/reading-figures.png';
import Approvals from '../Approvals';
import LoginForm from '../LoginForm';
import SignupForm from '../SignupForm';
import Logout from '../Logout';
import InterimModal from '../Modal';
import './HomePage.css';
import BookCard from '../BookCards';
import { getRandomNumber } from '../../helpers';

const HomePage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const currUser = useSelector(userActions.selUser);
    const list = useSelector(bookActions.selBooks);

    const [books, setBooks] = useState([]);
    const [book, setBook] = useState({});
    const [swipeDirection, setSwipeDirection] = useState('center');
    const [hovering, setHovering] = useState(false);
    const intervalRef = useRef(null);

    const browseBooks = (e) => {
        e.preventDefault();

        history.push('/books');
    }

    const setABook = () => {
        if (books && books.length > 0) {
            setSwipeDirection('right');
            const index = getRandomNumber(0, books.length - 1);
            setTimeout(() => {
                setBook(books[index]);
                setSwipeDirection('center'); // Swipe back to the right after the book has changed
            }, 500);
        }
    }

    useEffect(() => {
        dispatch(bookActions.getBooks({}));

        return () => {
            dispatch(bookActions.clearBooks());
        }
    }, [dispatch]);

    useEffect(() => {
        if (!hovering) {
            setABook();
        }

        intervalRef.current = setInterval(() => {
            if (!hovering) {
                setABook();
            }
        }, 5000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [books, hovering])

    useEffect(() => {
        if (list) {
            setBooks(list.books);
        }
    }, [list]);

    const onEnter = (e) => {
        e.preventDefault();
        setHovering(true);
        clearInterval(intervalRef.current);
    }

    const onLeave = (e) => {
        e.preventDefault();
        setHovering(false);
    }

    return (
        <div className='home-wrapper' >
            <div className="title">
                <h1>Welcome to HumanBound!</h1>
            </div>

            <div className='intro' >
                <h3>Find youre next read and join a Circle of friends today!</h3>
                <img src={readingFigures} alt='drawing of people reading together' />
            </div>

            <div className="books">
                <h3>BOOKS</h3>
                <p>
                    Hey there! As a site for book reading and sharing, you have tha ability to upload
                    youre favorite book's details for public use as well as free pdf links
                    for anyone who might want to read the book. We do encourage users who
                    add books to our library to write their own review, so that other users
                    may have an opportunity to hear about your experience and reply to your
                    words.
                </p>
                <p>
                    Also, don't worry about having all the information. HumanBound uses google books
                    to help fill out information for you. Just type into the title section any words
                    that may match your books description, and add authors to the author section to
                    tighten your search parameters!
                </p>

                <p>
                    Feel free to browse our book collection!
                </p>

                {
                    (book && book.id) ? (
                        <div className='wrap' onMouseEnter={onEnter} onMouseLeave={onLeave}>
                            <div className={`home-book-card swipe-${swipeDirection} ${hovering ? 'paused' : ''}`}>
                                <BookCard books={[book]} />
                            </div>
                        </div>
                    ) : null
                }

                <div className='home-btn'><button type="button" className='homepage-btn' onClick={browseBooks} >Browse Books</button></div>
            </div>

            <div className='circles'>
                <h3>CIRCLES</h3>

                <p>
                    Circles are places for you to meet with your friends or book club and
                    discuss your favorite books! If you do not have any friends, and you don't
                    know anyone literate, FEAR NOT! Browse our public circles and join one you find interesting!
                </p>

                <div className='home-btn'><button type='button' className='homepage-btn' onClick={e => e.preventDefault()} >Browse Circles</button></div>
            </div>

            <div className='buttons' >
                {
                    (currUser) ? (
                        <>
                            {(currUser.admin) ? (
                                <InterimModal Component={Approvals} btnTitle='Approvals' btnLabel={(<i className="fa-solid fa-bell">Approvals</i>)} btnClass={'homepage-btn'} params={{ ref: null }} />
                            ) : null}

                            <InterimModal Component={Logout} btnTitle="Logout" btnLabel={(<i className="fa-solid fa-arrow-right-from-bracket" >Logout</i>)} btnClass='homepage-btn' params={{ ref: null }} />
                        </>
                    ) : (
                        <>
                            <InterimModal Component={LoginForm} btnTitle='Login' btnLabel={(<i className="fa-solid fa-arrow-right-to-bracket" >Login</i>)} btnClass='homepage-btn' params={{ ref: null }} />
                            <InterimModal Component={SignupForm} btnTitle="Sign up" btnLabel={(<i className="fa-solid fa-user-plus" >Sign Up</i>)} btnClass='homepage-btn' params={{ ref: null }} />
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default HomePage;
