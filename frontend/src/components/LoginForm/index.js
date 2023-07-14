import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as userActions from "../../store/user";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";


export default function LoginForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const err = useSelector(userActions.selErr);
    const user = useSelector(userActions.selUser);

    const handleChange = (e) => {
        e.preventDefault();

        const { className, value } = e.target;

        switch(className) {
            case "credential":
                setCredential(value);
                break;

            case "password":
                setPassword(value);
                break;

            default:
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);

        dispatch(userActions.loginUser({ credential, password }));
    };

    const handleDemo1 = async (e) => {
        e.preventDefault();
        setErrors([]);

        dispatch(userActions.loginUser({ credential: "johndoe", password:"password123" }));
    }

    const handleDemo2 = (e) => {
        e.preventDefault();
        setErrors([]);

        dispatch(userActions.loginUser({ credential:"janesmith", password:"password456" }));
    }


    useEffect(() => {
        if (err && err.length) {
            setErrors(err);
        }
    }, [err, setErrors]);

    useEffect(() => {
        if (user && user.id) {
            history.push("/");
        }
    }, [user, history]);



    return (
        <div className="login-wrapper">
            <h1>Login</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <ul>
                { (errors && errors.length) ? errors.map((error, i) => (<li key={i}>{error}</li>)) : null}
                </ul>
                <input type="text" className="credential" placeholder="Username or Email" onChange={handleChange} value={credential} />
                <input type="password" className="password" placeholder="Password" onChange={handleChange} value={password} />
                <button type="submit" className="login-btn" >Log In</button>
                <button type="button" className="demo-btn" onClick={handleDemo2} >Demo User {"(non-admin)"}</button>
                <button type="button" className="demo-btn" onClick={handleDemo1} >Demo User {"(admin)"}</button>
            </form>
        </div>
    )
}
