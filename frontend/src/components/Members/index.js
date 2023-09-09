import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as memberActions from "../../store/member";
import { setDefaultProfImg } from "../../helpers";

const Members = ({circleId}) => {
    const dispatch = useDispatch();

    const membersList = useSelector(memberActions.selMembers);

    const [members, setMembers] = useState([]);

    useEffect(() => {
        dispatch(memberActions.getMembers(circleId));
    }, [dispatch]);

    useEffect(() => {
        if (membersList) {
            setMembers(membersList);
        }
    }, [membersList]);

    return (
        <div className="members-list">
            <h3>Members</h3>
            <div className="scrollable">
                {(members && members.length > 0) ? members.map(member => (
                    <div className="user" key={member.id}>
                        <img src={member.User.avi} alt={member.User.username} onError={setDefaultProfImg} />
                        <h4>@{member.User.username}</h4>
                    </div>
                )) : null}
            </div>
        </div>
    )
}


export default Members;
