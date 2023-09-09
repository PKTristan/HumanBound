import { useEffect, useState } from "react";
import { setDefaultProfImg } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import * as messageActions from "../../store/message";
import * as userActions from "../../store/user";

const Messages = ({ circleId, messages }) => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');

    const user = useSelector(userActions.selUser);
    const msgMsg = useSelector(messageActions.selMsg);
    const msgErr = useSelector(messageActions.selErr);

    useEffect(() => {
        if (msgMsg && msgMsg.length > 0) {
            dispatch(messageActions.clearMsg());
            dispatch(messageActions.getMessages(circleId));
        }
        else {
            console.log(msgMsg);
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

    const handleDelete = (id) => (e) => {
        e.preventDefault();

        dispatch(messageActions.deleteMessage(id));
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
                        </div>

                        <p>{message.message}</p>
                        {/* {(user.admin || user.id === message.User.id) ? <button type="button" onClick={handleDelete(message.id)}>Delete</button> : null} */}
                    </div>
                )) : <p>No messages...</p>}
            </div>
            <textArea placeholder={msgErr || 'Write a message...'} value={message} onChange={handleChange} />
            <button type="button" className="send-msg" onClick={handleClick}>Send</button>
        </div>
    )
}

export default Messages;
