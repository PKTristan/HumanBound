import BookCard from "../BookCards";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import * as circleActions from "../../store/circle";
import * as memberActions from "../../store/member";
import * as userActions from "../../store/user";
import './CircleCard.css';

const CircleCard = ({ circles }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const user = useSelector(userActions.selUser);
    const memberships = useSelector(memberActions.selMemberships);
    const fetchErr = useSelector(circleActions.selErr);

    const [isHidden, setIsHidden] = useState(true);
    const [memMsg, setMemMsg] = useState('');
    const [id, setId] = useState(null);
    const [memTable, setMemTable] = useState({});

    useEffect(() => {
        dispatch(memberActions.getMemberships());
    }, [dispatch]);

    useEffect(() => {
        let obj = {};

        if (memberships && Array.isArray(memberships)) {
            memberships.forEach(member => {
                obj[member.circleId] = member.status;
            })
            setMemTable({ ...obj });
        }
    }, [memberships]);

    const handleClick = (id) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        setId(id);

        if (id === null) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }
    }

    const handleCardClick = (id) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        setId(id);

        if (id === null) {
            setMemMsg('');
        }else if (user.admin) {
            history.push(`/circles/${id}`);
        } else if (memTable[id] === undefined) {
            setMemMsg('nonmember');
        } else if (memTable[id] === 'pending') {
            setMemMsg('pending');
        } else if (memTable[id].length > 0) {
            history.push(`/circles/${id}`);
        }
    }

    return (
        <div className='circle-cards'>
            {
                (circles && circles.length) ? circles.map(circle => (
                    <div className='circle-card' key={circle.id} onClick={handleCardClick(circle.id)} >
                        <h4 >{circle.name}</h4>
                        <h5 >hosted by {circle.User.username}</h5>
                        <h5 >Members: {circle.memberCount}</h5>
                        <button type='button' onClick={handleClick(circle.id)} hidden={!isHidden && (id === circle.id)} >Show Current Read</button>
                        <div className='pop-up-book' hidden={isHidden || id !== circle.id}>
                            <button type='button' onClick={handleClick(null)}>X</button>
                            <BookCard books={[circle.Book]} />
                        </div>
                        <div className='pop-up-circle' hidden={(memMsg !== 'pending' && memMsg !== 'nonmember') || id !== circle.id}>
                            <button type='button' onClick={handleCardClick(null)}>X</button>
                            {memMsg === 'pending' && <h2>Membership status pending! Please wait for a host to accept you.</h2>}
                            {memMsg === 'nonmember' && <h2>You are not a member of this circle!</h2>}
                        </div>
                    </div>
                )) : null
            }
        </div>
    );
}


export default CircleCard;
