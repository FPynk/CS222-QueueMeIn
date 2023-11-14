import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './StudentStart.module.css';
import { db, auth } from '../../firebase'
import { getDoc, doc } from 'firebase/firestore'
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { userStore } from '../../store'

async function checkRegisteredStudent(email) {
    let ans = false;
    await getDoc(doc(db, "studentProfiles", email))
        .then((doc) => { // checks if email is registered to a recruiter account
            ans = (doc.data() != undefined)
        })
    return ans;
}

function StudentStart() {
    const user = userStore((state) => state)

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
        
        let registered = await checkRegisteredStudent(email)
        if(!registered) {
            clearInterval(intervalId);
            setLoginError('Not a student registered email')
            return; 
        } else {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => { // redirect to /home after signin success
                clearInterval(intervalId);
                user.setEmail(email)
                user.setIsRecruiter(false)
                user.setEventID("")
                
                // const user = userCredential.user;
                navigate('/home');
            })
            .catch((error) => {
                console.log(error)
                clearInterval(intervalId);
                setLoginError('Invalid Email or Password');
                setPassword('');
            });
        }
    };
  
    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className= {styles['h-screen-flex']}>
            <h1 className={styles['text-8xl-center']}>QueueMeIn</h1>
            <p className={styles['text-3xl-center']}>Student Login</p>
            <button
                onClick={() => navigate('/')}
                className={styles['top-left-button']}
            >
                Back
            </button>

            <div className={styles['mt-8']}>
                <Link to="/student-register">
                    <button className={styles['mt-8-button']}>
                        Sign Up
                    </button>
                </Link>
            </div>
            
            <div className={styles['mt-4']}>
                <input
                    type="text"
                    ref={emailRef}
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyUp={handleInputKeyPress}
                    className={styles['input-box']}
                />
            </div>

            <div className={styles['mt-4']}>
                <input
                    type="password"
                    ref={passwordRef}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyUp={handleInputKeyPress}
                    className={styles['input-box']}
                />
            </div>

            {loginError && (
                <div className={styles['text-red']}>{loginError}</div>
            )}

            <div className={styles['mt-4']}>
                <button
                    className={styles['mt-4-button']}
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default StudentStart;