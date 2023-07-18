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

            <div className="navbar-btn" >
                <button type='button' className='navbar-btn' onClick={handleBooks}><i className="fa-solid fa-book" /></button>
            </div>

            <div className="prof-btn" ref={ref}>
                <button type="button" className='prof-btn' onClick={icon}>
                    <i className="fa-solid fa-user" />
                </button>
                {dropdown &&
                    <div className='prof-dropdown'>
                        {currUser && (<>
                            <p>Hello, {currUser.username}</p>
                            <p>{currUser.firstName} {currUser.lastName}</p>
                            <p>{currUser.email}</p>

                            {(currUser && currUser.admin) ?
                                (<InterimModal Component={Approvals} btnLabel={'Approvals'} btnClass={'navbar-btn'} params={{ ref }} />) : null
                            }
                            <InterimModal Component={BookForm} btnLabel={'Add Book'} btnClass={'navbar=btn'} params={{ ref, isEdit: false }} />
                            <InterimModal Component={Logout} btnLabel={"Logout"} btnClass='navbar-btn' params={{ ref }} />
                        </>
                        )}

                        {!currUser && (<>
                            <p>Welcome!</p>
                            <p>Please sign up or login</p>

                            <InterimModal Component={LoginForm} btnLabel="Login" btnClass='navbar-btn' params={{ ref }} />
                            <InterimModal Component={SignupForm} btnLabel='Sign Up' btnClass='navbar-btn' params={{ ref }} />
                        </>)}

                    </div>}
            </div>

        </div>
    )
}


export default NavBar;
