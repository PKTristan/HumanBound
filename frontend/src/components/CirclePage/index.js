import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Draggable from "react-draggable";

import * as circleActions from "../../store/circle";
import * as messageActions from "../../store/message";
import BookCard from "../BookCards";
import Members from "../Members";
import Messages from "../Messages";
import './CirclePage.css';

const CirclePage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();

    const circleDetails = useSelector(circleActions.selCircle);
    const msgList = useSelector(messageActions.selMessages);

    const [circle, setCircle] = useState({});
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        dispatch(circleActions.getCircle(id));
        dispatch(messageActions.getMessages(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (circleDetails) {
            setCircle(circleDetails.circle);
        }
    }, [circleDetails]);

    useEffect(() => {
        if (msgList) {
            setMessages(msgList);
        }
    }, [msgList]);


    return (
        <div className='circle-page'>
            {(Object.keys(circle).length < 1) ? (
                <h1>Loading Circle Page...</h1>
            ) : (
                <>
                    <h1>{circle.name}</h1>
                    <h4>hosted by {circle.User.username}</h4>
                    <div className='drag-area'>
                    <Draggable
                        axis="both"
                        handle=".book-handle"
                    >
                        <div className='book-dragger' >
                            <p className='book-handle'>drag from here</p>
                            <BookCard books={[circle.Book]} />
                        </div>
                    </Draggable>

                    <Draggable
                        axis="both"
                        handle=".members-handle"
                    >
                        <div className="members-dragger">
                            <p className="members-handle">drag from here</p>
                            <Members circleId={id} />
                        </div>
                    </Draggable>


                    <Draggable
                        axis="both"
                        handle=".messages-handle"
                    >
                        <div className="messages-dragger">
                            <p className="messages-handle">drag from here</p>
                            <Messages circleId={id} messages={messages}/>
                        </div>
                    </Draggable>
                    </div>

                    </>
            )}
                </div>
            )
}

            export default CirclePage;
