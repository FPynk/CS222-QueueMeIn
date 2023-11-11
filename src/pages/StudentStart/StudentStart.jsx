import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentStart.css';
import { auth } from '../../firebase'
import {  signInWithEmailAndPassword   } from 'firebase/auth';

function StudentStart() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
  
    const navigate = useNavigate();
  
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
  
    const handleLogin = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setLoginError('Invalid email address');
            return;
        }
        
        // Clear existing error messages
        setLoginError('');

        // For loading message
        let counter = 0;
        const loading_messages = ['Logging in.', 'Logging in..', 'Logging in...'];
        
        // Cycle messages to make an animation effect
        const intervalId = setInterval(() => {
            setLoginError(loading_messages[counter]);
            counter = (counter + 1) % 3;   // Cycle from 0 to 2
        }, 500);                           // Update every 500ms

        // Actual login check logic here
        // Firebase sign in
        
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => { // redirect to /home after signin success
            clearInterval(intervalId);
            const user = userCredential.user;
            window.location.href = '/home';
            console.log(user);
        })
        .catch((error) => {
            clearInterval(intervalId);
            setLoginError('Invalid Email or Password');
            setPassword('');
        });
    };
  
    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="h-screen-flex">
            <h1 className="text-8xl-center">QueueMeIn</h1>
            <p className="text-3xl-center">Student Login</p>
            <button
                onClick={() => navigate('/')}
                className="top-left-button"
            >
                Back
            </button>

            <div className="mt-8">
                <Link to="/student-register">
                    <button className="mt-8-button">
                        Sign Up
                    </button>
                </Link>
            </div>
            
            <div className="mt-4">
                <input
                    type="text"
                    ref={emailRef}
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyUp={handleInputKeyPress}
                    className="input-box"
                />
            </div>

            <div className="mt-4">
                <input
                    type="password"
                    ref={passwordRef}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyUp={handleInputKeyPress}
                    className="input-box"
                />
            </div>

            {loginError && (
                <div className="text-red">{loginError}</div>
            )}

            <div className="mt-4">
                <button
                    className="mt-4-button"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default StudentStart;