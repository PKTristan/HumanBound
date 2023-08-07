import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState, useEffect } from "react";
import * as userActions from "../../store/user";


const Logout = ({params: {ref}, setIsOpen}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([]);

    const err = useSelector(userActions.selErr);
    const msg = useSelector(userActions.selMsg);

    const handleYes = (e) => {
        e.preventDefault();

        dispatch(userActions.logout());
        setIsOpen(false);
    };

    const handleNo = (e) => {
        e.preventDefault();

        setIsOpen(false);
    };

    useEffect(() => {
        if (err && err.length) {
            setErrors(err);
        }

        if (msg) {
            history.push('/');
        }
    }, [err, msg, history, setErrors]);


    return (
        <div className='logout-confirmation' ref={ref && ref}>
            <h1>Confirm Logout</h1>
            <p> Are you sure you want to logout?</p>
            <button className='yes' onClick={handleYes}>Yes</button>
            <button className='no' onClick={handleNo}>No</button>
        </div>
    )
}

export default Logout;
