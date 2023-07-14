//frontend components navbar

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import * as userActions from "../../store/user";
import { useRef, useState, useEffect } from "react";
import InterimModal from "../Modal";
import LoginForm from "../LoginForm";
import Logout from "../Logout";


const NavBar = () => {
    const ref = useRef();
    const currUser = useSelector(userActions.selUser);


    const [dropdown, setDropdown] = useState(false);

    const icon = (e) => {
        e.preventDefault();

        setDropdown(!dropdown);
    };

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

    return (
        <div className="navbar">

            <div className="prof-btn">
                <button type="button" className='prof-btn' onClick={icon}>
                    <i className="fa-solid fa-user" />
                </button>
                { dropdown &&
                <div className='prof-dropdown' ref={ref}>
                    {currUser && (<>
                        <p>Hello, {currUser.username}</p>
                        <p>{currUser.firstName} {currUser.lastName}</p>
                        <p>{currUser.email}</p>

                        <InterimModal Component={Logout} btnLabel={"Logout"} btnClass='navbar-btn' params={{ref}} />
                        </>
                    )}

                    {!currUser && (<>
                        <p>Welcome!</p>
                        <p>Please sign up or login</p>

                        <InterimModal Component={LoginForm} btnLabel="Login" btnClass='navbar-btn'params={{ref}}/>
                    </>)}

                </div>}
            </div>
        </div>
    )
}


export default NavBar;
