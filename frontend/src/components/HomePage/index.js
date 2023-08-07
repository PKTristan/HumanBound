import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as userActions from '../../store/user';
import Approvals from '../Approvals';
import LoginForm from '../LoginForm';
import SignupForm from '../SignupForm';
import Logout from '../Logout';
import InterimModal from '../Modal';
import './HomePage.css';

const HomePage = () => {
    const dispatch = useDispatch();
    const currUser = useSelector(userActions.selUser);

    return (
        <div className='home-wrapper' >
            <div className="title">
                <h1>Welcome to HumanBound!</h1>
            </div>

            <div className='intro' >
                <h3>Find youre next read and join a Circle of friends today!</h3>
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
                    tighten your search paramters!
                </p>

                <p>
                    Feel free to browse our book collection!
                </p>
            </div>

            <div className='circles'>
                <h3>CIRCLES</h3>

                <p>
                    Circles are places for you to meet with your friends or book club and
                    discuss your favorite books! If you do not have any friends, and you don't
                    know anyone literate, FEAR NOT! Browse our public circles and join one you find interesting!
                </p>
            </div>

            <div className='buttons' >
                {
                    (currUser) ? (
                        <>
                            {(currUser.admin) ? (
                                <InterimModal Component={Approvals} btnTitle='Approvals' btnLabel={'Approvals'} btnClass={'homepage-btn'} params={{ref: null}} />
                            ): null}

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
