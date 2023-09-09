import { useEffect, useState } from "react";
import { setDefaultProfImg } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import * as messageActions from "../../store/message";
import * as circleActions from "../../store/circle";

const Messages = ({ circleId, messages }) => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');

    const msgMsg = useSelector(messageActions.selMsg);
    const msgErr = useSelector(messageActions.selErr);

    useEffect(() => {
        if (msgMsg === 'Message Created') {
            dispatch(messageActions.clearMsg());
            dispatch(messageActions.getMessages(circleId));
        }
    }, [msgMsg, dispatch]);


    const handleChange = (e) => {
        e.preventDefault();

        if (msgErr) {
            dispatch(messageActions.clearErr());
        }

        setMessage(e.target.value);
    }

    const handleClick = (e) => {
        e.preventDefault();

        setMessage('');

        dispatch(messageActions.createMessage(circleId, message));
    }

    return (
        <div className='messages-wrapper'>
            <h3>Messages</h3>
            <div className='scrollable'>
                {(messages && messages.length > 0) ? messages.map(message => (
                    <div className='message' key={message.id}>
                        <div className='user'>
                            <img src={message.User.avi} alt={message.User.username} onError={setDefaultProfImg} />
                            <h4>@{message.User.username}</h4>
                            <p>{message.message}</p>
                        </div>
                    </div>
                )) : <p>No messages...</p>}
            </div>
            <textArea type='text' placeholder={msgErr || 'Write a message...'} value={message} onChange={handleChange} />
            <button type="button" className="send-msg" onClick={handleClick}>Send</button>
        </div>
    )
}

export default Messages;
