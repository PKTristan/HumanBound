//frontend components navbar
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import * as userActions from "../../store/user";
import { useRef, useState, useEffect } from "react";
import InterimModal from "../Modal";
import LoginForm from "../LoginForm";
import Logout from "../Logout";
import SignupForm from "../SignupForm";
import BookForm from "../BookForm";
import './NavBar.css';
import Approvals from "../Approvals";
import { setDefaultProfImg } from "../../helpers";


const NavBar = () => {
    const history = useHistory();
    const ref = useRef();
    const currUser = useSelector(userActions.selUser);


    const [dropdown, setDropdown] = useState(false);

    const icon = (e) => {
        e.preventDefault();

        setDropdown(!dropdown);
    };

    const handleBooks = (e) => {
        e.preventDefault();
        history.push('/books');
    }

    useEffect(() => {
        if (!dropdown) return;

        const clickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setDropdown(false);
            }
        }

        document.addEventListener("mousedown", clickOutside);

        return () => document.removeEventListener("mousedown", clickOutside);
    }, [ref, dropdown, setDropdown]);

    useEffect(() => {
        setDropdown(false);

    }, [currUser, setDropdown]);

    return (
        <div className="navbar">

            <div className="navbar-buttons" >
                <button type='button' className='navbar-btn' onClick={() => { history.push('/'); }} title="Home"><i className="fa-solid fa-house" /></button>
                <button type='button' className='navbar-btn' onClick={handleBooks} title="Books"><i className="fa-solid fa-book" /></button>
            </div>

            <div className="prof-btn-div" ref={ref}>
                <button type="button" className='prof-btn' onClick={icon} title='Profile Button'>
                    <i className="fa-solid fa-bars" />
                </button>
                {dropdown &&
                    <div className='prof-dropdown'>
                        {currUser && (<>
                        <img src={currUser.avi} alt={currUser.username} onError={setDefaultProfImg} />
                            <p>Hello, {currUser.firstName} {currUser.lastName}</p>
                            <p>@{currUser.username}</p>

                            {(currUser && currUser.admin) ?
                                (<InterimModal Component={Approvals} btnTitle='Approvals' btnLabel={'Approvals'} btnClass={'navbar-btn'} params={{ ref }} />) : null
                            }
                            <InterimModal Component={BookForm} btnTitle="Add Book" btnLabel={(<><i className="fa-solid fa-plus" /> <i className="fa-solid fa-book" /></>)} btnClass={'navbar-btn'} params={{ ref, isEdit: false }} />
                            <InterimModal Component={Logout} btnTitle="Logout" btnLabel={(<i className="fa-solid fa-arrow-right-from-bracket" />)} btnClass='navbar-btn' params={{ ref }} />
                        </>
                        )}

                        {!currUser && (<>
                            <p>Welcome!</p>
                            <p>Please sign up or login</p>

                            <InterimModal Component={LoginForm} btnTitle='Login' btnLabel={(<i className="fa-solid fa-arrow-right-to-bracket" />)} btnClass='navbar-btn' params={{ ref }} />
                            <InterimModal Component={SignupForm} btnTitle="Sign up" btnLabel={(<i className="fa-solid fa-user-plus" />)} btnClass='navbar-btn' params={{ ref }} />
                        </>)}

                    </div>}
            </div>

        </div>
    )
}


export default NavBar;
