// sign up form
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as userActions from '../../store/user';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const SignupForm = ({setIsOpen, params: {ref}}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [avi, setAvi] = useState('');
    const [errors, setErrors] = useState([]);

    const err = useSelector(userActions.selErr);
    const user = useSelector(userActions.selUser);


    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            firstName,
            lastName,
            email,
            avi,
            username,
            password
        }

        dispatch(userActions.signupUser(user, setIsOpen));
    }


    const isValidUrl = urlString => {
        try {
            return Boolean(new URL(urlString));
        }
        catch (e) {
            return false;
        }
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };


    const handleChange = (e) => {
        e.preventDefault();

        const { className, value } = e.target;

        let mutErr = errors;

        switch(className) {
            case "firstName":
                setFirstName(value);
                if (value.length > 1 && value.length < 21) {
                    mutErr = mutErr.filter(err => err !== "Please provide a first name between 1 and 20 characters.");
                }
                break;

            case 'lastName':
                setLastName(value);
                if (value.length > 1 && value.length < 21) {
                    mutErr = mutErr.filter(err => err !== "Please provide a last name between 1 and 20 characters.");
                }
                break;

            case 'email':
                setEmail(value);
                if (validateEmail(value)) {
                    mutErr = mutErr.filter(err => err !== "Please provide a valid email.");
                }
                break;

            case 'username':
                setUsername(value);
                if (value.length > 3) {
                    mutErr = mutErr.filter(err => err !== "Please provide a username with at least 4 characters." && err !== 'username must be unique');
                }
                break;

            case 'password':
                setPassword(value);
                if (value.length > 5) {
                    mutErr = mutErr.filter(err => err !== "Password must be 6 characters or more.");
                }
                break;

            case 'confirmation':
                setConfirm(value);
                mutErr = mutErr.filter(err => err !== 'Passwords do not match');
                if (password !== value) {
                    mutErr.push('Passwords do not match');
                }
                break;

            case 'avi':
                setAvi(value);
                mutErr = mutErr.filter(err => err !== 'Avatar must be a valid image url');
                if (value.length > 0 && !isValidUrl(value)) {
                    mutErr.push('Avatar must be a valid image url');
                }
                break;

            default:
                break;
        }


        setErrors(mutErr);
    };


    useEffect(() => {
        if (err && err.length) {
            setErrors(err);
        }
    }, [err, setErrors]);


    // useEffect(() => {
    //     if (user && user.id) {
    //         history.push("/");
    //     }
    // }, [user, history]);

    useEffect(() => {
        return () => dispatch(userActions.clearErr());
    }, []);


    return (
        <div className="signup-wrapper" ref={ref}>
            <h1>Sign Up</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <ul>
                    {(errors && errors.length) ? errors.map((error, i) => (<li key={i}>{error}</li>)) : null}
                </ul>
                <input type="text" className="firstName" placeholder="First Name" onChange={handleChange} value={firstName} />
                <input type="text" className="lastName" placeholder='Last Name' onChange={handleChange} value={lastName} />
                <input type="email" className="email" placeholder="Email" onChange={handleChange} value={email} />
                <input type="text" className="username" placeholder="Username" onChange={handleChange} value={username} />
                <input type="password" className="password" placeholder="Password" onChange={handleChange} value={password} />
                <input type="password" className="confirmation" placeholder='Confirm Password' onChange={handleChange} value={confirm} />
                <input type="url" className="avi" placeholder="Avatar Image URL" onChange={handleChange} value={avi} />
                <button type="submit" className="signup-btn">Sign Up</button>
            </form>
        </div>
    )
}


export default SignupForm;
