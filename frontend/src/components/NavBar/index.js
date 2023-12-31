//frontend components navbar
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as userActions from "../../store/user";
import * as bookActions from "../../store/book";
import { useRef, useState, useEffect } from "react";
import InterimModal from "../Modal";
import LoginForm from "../LoginForm";
import Logout from "../Logout";
import SignupForm from "../SignupForm";
import BookForm from "../BookForm";
import CircleForm from "../CircleForm";
import './NavBar.css';
import Approvals from "../Approvals";
import { setDefaultProfImg } from "../../helpers";


const NavBar = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const ref = useRef(null);
    const currUser = useSelector(userActions.selUser);


    const [dropdown, setDropdown] = useState(false);

    const icon = (e) => {
        e.preventDefault();

        setDropdown(!dropdown);
    };

    const handleNav = (str) => (e) => {
        e.preventDefault();
        history.push(`/${str}`);
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
                <button type='button' className='navbar-btn' onClick={handleNav('')} title="Home"><i className="fa-solid fa-house" /></button>
                <button type='button' className='navbar-btn' onClick={handleNav('books')} title="Books"><i className="fa-solid fa-book" /></button>
                <button type='button' className="navbar-btn" onClick={handleNav('circles')} title="Circles"><i className="fa-solid fa-circle" /></button>
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
                                (<InterimModal Component={Approvals} btnTitle='Approvals' btnLabel={(<i className="fa-solid fa-bell"></i>)} btnClass={'navbar-btn'} params={{ ref, setDropdown }} />) : null
                            }
                            <InterimModal Component={BookForm} btnTitle="Add Book" btnLabel={(<><i className="fa-solid fa-plus" /> <i className="fa-solid fa-book" /></>)} btnClass={'navbar-btn'} params={{ ref, isEdit: false, setDropdown }} />
                            <InterimModal Component={CircleForm} btnTitle="Add Circle" btnLabel={(<><i className="fa-solid fa-plus" /> <i className="fa-solid fa-circle" /></>)} btnClass={'navbar-btn'} params={{ ref, setDropdown }} />
                            <InterimModal Component={Logout} btnTitle="Logout" btnLabel={(<i className="fa-solid fa-arrow-right-from-bracket" />)} btnClass='navbar-btn' params={{ ref, setDropdown }} />
                        </>
                        )}

                        {!currUser && (<>
                            <p>Welcome!</p>
                            <p>Please sign up or login</p>

                            <InterimModal Component={LoginForm} btnTitle='Login'  btnLabel={(<i className="fa-solid fa-arrow-right-to-bracket" />)} btnClass='navbar-btn' params={{ ref, setDropdown }} />
                            <InterimModal Component={SignupForm} btnTitle="Sign up"  btnLabel={(<i className="fa-solid fa-user-plus" />)} btnClass='navbar-btn' params={{ ref, setDropdown }} />
                        </>)}

                    </div>}
            </div>

        </div>
    )
}


export default NavBar;
