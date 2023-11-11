import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RecruiterStart.css';
import { useStore } from '../../store'
import { auth } from '../../firebase'
import {  signInWithEmailAndPassword   } from 'firebase/auth';

function RecruiterStart() {
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
  
    const handleLogin = () => {
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

        // TODO: Add your actual login check logic here
        //firebase sign in 
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => { // redirect to /home after signin success
            useStore.getState().setEmail(email);
            useStore.getState().setIsRecruiter(false);
            useStore.getState().setCurrentEventID("");
            
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
            <p className="text-3xl-center">Recruiter Login</p>
            <button
                onClick={() => navigate('/')}
                className="top-left-button"
            >
                Back
            </button>

            <div className="mt-8">
                <Link to="/recruiter-register">
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

export default RecruiterStart;