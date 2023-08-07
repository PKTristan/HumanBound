import * as approvalActions from '../../store/approval.js';
import * as bookActions from '../../store/book.js';
import * as userActions from '../../store/user.js';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './Approvals.css';


const Approvals = ({ params: { ref } }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const newRefs = useRef([]);
    const oldRefs = useRef([]);

    const approvals = useSelector(approvalActions.selApprovals);
    const user = useSelector(userActions.selUser);
    const errApp = useSelector(approvalActions.selErr);
    const msgApp = useSelector(approvalActions.selMsg);
    const msgBook = useSelector(bookActions.selMsg);

    const [newApprovals, setNewApprovals] = useState('');
    const [oldApprovals, setOldApprovals] = useState('');
    const [errors, setErrors] = useState([]);


    const handleApprove = ({difference, approval}) => (e) => {
        e.preventDefault();

        if (approval.reason.slice(0, 4) === 'EDIT') {
            let bookEdit = {
                bookId: approval.bookId,
                title: ((difference.titles) ? approval.title : approval.Book.title),
                subtitle: ((difference.subtitles) ? approval.subtitle : approval.Book.subtitle),
                authors: ((difference.authors) ? approval.authors : approval.Book.authors),
                publishYear: ((difference.publishYears) ? approval.publishYear : approval.Book.publishYear),
                pageCount: ((difference.pageCounts) ? approval.pageCount : approval.Book.pageCount),
                synopsis: ((difference.synopsis) ? approval.synopsis : approval.Book.synopsis),
                pdfLink: ((difference.pdfLinks) ? approval.pdfLink : approval.Book.pdfLink),
                thumbnail: ((difference.thumbnails) ? approval.thumbnail : approval.Book.thumbnail),
            };

            dispatch(bookActions.editBook({book: bookEdit, id: approval.bookId}));
            dispatch(approvalActions.approve(approval.id));

        }
        else if (approval.reason.slice(0,6) === 'DELETE') {
            dispatch(bookActions.deleteBook(approval.bookId));
            dispatch(approvalActions.approve(approval.id));
        }

        dispatch(bookActions.getBooks({}));
        dispatch(approvalActions.getApprovals());
    }

    const handleDeny = (approval) => (e) => {
        e.preventDefault();
        dispatch(approvalActions.deny(approval.id));

        dispatch(approvalActions.getApprovals());
    }


    const getDifferences = (app) => {
        const { Book, title, subtitle, authors, pdfLink, thumbnail, pageCount, publishYear, synopsis, reason, status } = app;

        let difference = {};

        if (title !== Book.title) {
            difference.titles = { appTitle: title, bookTitle: Book.title };
        }

        if (subtitle !== Book.subtitle) {
            difference.subtitles = { appSubtitle: subtitle, bookSubtitle: Book.subtitle };
        }

        if (authors) {
            if (Array.isArray(authors) && Array.isArray(Book.authors)) {
                if (authors.sort().toString() !== Book.authors.sort().toString()) {
                    difference.authors = { appAuthors: authors, bookAuthors: Book.authors };
                }
            }
            else {
                difference.authors = { appAuthors: authors, bookAuthors: Book.authors };
            }

        }

        if (pdfLink !== Book.pdfLink) {
            difference.pdfLinks = { appPdfLink: pdfLink, bookPdfLink: Book.pdfLink };
        }

        if (thumbnail !== Book.thumbnail) {
            difference.thumbnails = { appThumbnail: thumbnail, bookThumbnail: Book.thumbnail };
        }

        if (pageCount !== Book.pageCount) {
            difference.pageCounts = { appPageCount: pageCount, bookPageCount: Book.pageCount };
        }

        if (publishYear !== Book.publishYear) {
            difference.publishYears = { appPublishYear: publishYear, bookPublishYear: Book.publishYear };
        }

        if (synopsis !== Book.synopsis) {
            difference.synopsis = { appSynopsis: synopsis, bookSynopsis: Book.synopsis };
        }

        return difference;
    }

    useEffect(() => {
        dispatch(approvalActions.getApprovals());
    }, [dispatch]);

    useEffect(() => {
        if (approvals) {
            setNewApprovals(approvals.pending);
            setOldApprovals(approvals.acknowledged);
            newRefs.current = new Array(approvals.pending.length)
                .fill(null)
                .map(() => React.createRef());
            oldRefs.current = new Array(approvals.acknowledged.length)
                .fill(null)
                .map(() => React.createRef());
        }
    }, [approvals, setNewApprovals, setOldApprovals]);


    const appCardClick = (obj) => (e) => {
        e.preventDefault();
        let element = null;

        if (obj.type === 'new') {
            element = newRefs.current[obj.idx].current
        }
        else if (obj.type === 'old') {
            element = oldRefs.current[obj.idx].current
        }

        if (element) {
            if (element.style.width === '185px' || element.style.width === '') {
                element.style.width = '100%';
            }
            else {
                element.style.width = '185px';
            }
        }
    }


    return (
        <div className="approvals" ref={ref && ref}>
            <h1>Pending Approvals</h1>
            <div className='new-approvals'>
                {
                    (newApprovals.length) ? newApprovals.map((approval, idx) => {
                        const difference = getDifferences(approval);

                        return (
                            <div key={approval.id} className="app-card" onClick={appCardClick({idx, type: 'new'})} ref={newRefs.current[idx]} >
                                {(difference.thumbnails) ? (<div className='app-images app-content'>
                                    <img className="approval-img" src={difference.thumbnails.appThumbnail} alt="thumbnail" />
                                    <h5> -{'>'} </h5>
                                    <img className="approval-img" src={difference.thumbnails.bookThumbnail} alt="thumbnail" />
                                </div>) : (<div className='app-images'>
                                    <img className="approval-img" src={approval.Book.thumbnail} alt="thumbnail" />
                                </div>)}

                                {(difference.titles) ? (<div className="app-titles app-content">
                                    <h4>Title: {difference.titles.bookTitle}</h4>
                                    <h5> -{'>'} </h5>
                                    <h4>{difference.titles.appTitle}</h4>
                                </div>) : (<div className="app-titles">
                                    <h4>Title: {approval.Book.title}</h4>
                                </div>) }

                                {(difference.subtitles) ? (<div className="app-subtitles app-content">
                                    <h5>Subtitle: {difference.subtitles.bookSubtitle + ' -> ' + difference.subtitles.appSubtitle}</h5>
                                </div>) : null}

                                {(difference.authors && difference.authors.bookAuthors && difference.authors.appAuthors && difference.authors.bookAuthors.length && difference.authors.appAuthors.length) ? (<div className="app-authors">
                                    <h5>
                                        Authors: {((Array.isArray(difference.authors.bookAuthors)) ? (difference.authors.bookAuthors.join(', ')) : difference.authors.bookAuthors) + ' -> ' + ((Array.isArray(difference.authors.appAuthors)) ? (difference.authors.appAuthors.join(', ')) : difference.authors.appAuthors)}
                                    </h5>
                                </div>) : null}

                                {(difference.pdfLinks) ? (<div className="app-pdf app-content">
                                    <h5>pdf: {difference.pdfLinks.bookPdfLink + ' -> ' + difference.pdfLinks.appPdfLink}</h5>
                                </div>) : null}

                                {(difference.pageCounts) ? (<div className="app-page app-content">
                                    <h5>pages: {difference.pageCounts.bookPageCount + ' -> ' + difference.pageCounts.appPageCount}</h5>
                                </div>) : null}

                                {(difference.publishYears) ? (<div className="app-year app-content">
                                    <h5>Year: {difference.publishYears.bookPublishYear + ' -> ' + difference.publishYears.appPublishYear}</h5>
                                </div>) : null}

                                {(difference.synopsis) ? (<div className="app-synopsis app-content">
                                    <h5>Synopsis: </h5>
                                    <h5>{difference.synopsis.bookSynopsis}</h5>
                                    <h5> -{'>'} </h5>
                                    <h5>{difference.synopsis.appSynopsis}</h5>
                                </div>) : null}

                                {(approval.reason) ? (<div className="app-reason app-content">
                                    <h5>Reason: {approval.reason}</h5>
                                </div>) : null}

                                {(approval.status) ? (<div className="app-status app-content">
                                    <h5>Status: {approval.status}</h5>
                                </div>) : null}

                                <div className="app-buttons">
                                    <button onClick={handleApprove({difference, approval})}>Approve</button>
                                    <button onClick={handleDeny(approval)}>Deny</button>
                                </div>
                            </div>
                        )
                    }) : <h3>No pending approvals...</h3>
                }
            </div>
            <h1>Reviewed Approvals</h1>
            <div className='old-approvals'>
                {
                    (oldApprovals.length) ? oldApprovals.map((approval, idx) => {
                        const difference = getDifferences(approval);

                        return (
                            <div key={approval.id} className="app-card" onClick={appCardClick({idx, type: 'old'})}  ref={oldRefs.current[idx]}  >
                                {(difference.thumbnails) ? (<div className='app-images app-content'>
                                    <img className="approval-img" src={difference.thumbnails.appThumbnail} alt="thumbnail" />
                                    <h5> -{'>'} </h5>
                                    <img className="approval-img" src={difference.thumbnails.bookThumbnail} alt="thumbnail" />
                                </div>) : (<div className='app-images'>
                                    <img className="approval-img" src={approval.Book.thumbnail} alt="thumbnail" />
                                </div>)}

                                {(difference.titles) ? (<div className="app-titles app-content">
                                    <h4>Title: {difference.titles.bookTitle}</h4>
                                    <h5> -{'>'} </h5>
                                    <h4>{difference.titles.appTitle}</h4>
                                </div>) : (<div className="app-titles">
                                    <h4>Title: {approval.Book.title}</h4>
                                </div>)}

                                {(difference.subtitles) ? (<div className="app-subtitles app-content">
                                    <h5>Subtitle: {difference.subtitles.bookSubtitle + ' -> ' + difference.subtitles.appSubtitle}</h5>
                                </div>) : null}

                                {(difference.authors && difference.authors.bookAuthors && difference.authors.appAuthors && difference.authors.bookAuthors.length && difference.authors.appAuthors.length) ? (<div className="app-authors">
                                    <h5>
                                        Authors: {((Array.isArray(difference.authors.bookAuthors)) ? (difference.authors.bookAuthors.join(', ')) : difference.authors.bookAuthors) + ' -> ' + ((Array.isArray(difference.authors.appAuthors)) ? (difference.authors.appAuthors.join(', ')) : difference.authors.appAuthors)}
                                    </h5>
                                </div>) : null}

                                {(difference.pdfLinks) ? (<div className="app-pdf app-content">
                                    <h5>pdf: {difference.pdfLinks.bookPdfLink + ' -> ' + difference.pdfLinks.appPdfLink}</h5>
                                </div>) : null}

                                {(difference.pageCounts) ? (<div className="app-page app-content">
                                    <h5>pages: {difference.pageCounts.bookPageCount + ' -> ' + difference.pageCounts.appPageCount}</h5>
                                </div>) : null}

                                {(difference.publishYears) ? (<div className="app-year app-content">
                                    <h5>Year: {difference.publishYears.bookPublishYear + ' -> ' + difference.publishYears.appPublishYear}</h5>
                                </div>) : null}

                                {(difference.synopsis) ? (<div className="app-synopsis app-content">
                                    <h5>Synopsis: </h5>
                                    <h5>{difference.synopsis.bookSynopsis}</h5>
                                    <h5> -{'>'} </h5>
                                    <h5>{difference.synopsis.appSynopsis}</h5>
                                </div>) : null}

                                {(approval.reason) ? (<div className="app-reason app-content">
                                    <h5>Reason: {approval.reason}</h5>
                                </div>) : null}

                                {(approval.status) ? (<div className="app-status app-content">
                                    <h5>Status: {approval.status}</h5>
                                </div>) : null}

                            </div>
                        )
                    }) : <h3>No reviewed approvals...</h3>
                }
            </div>
        </div>
    )
}

export default Approvals;
