import React, { useState } from 'react';
import { ChakraProvider, Box, Text, Input, Button, VStack } from '@chakra-ui/react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import { userStore } from '../../store';

import styles from './StudentRegister.module.css';  // Importing your external CSS

function StudentRegister() {
    const user = userStore((state) => state)

    // State variables to hold form inputs like email, password, confirmpassword
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Use for navigation
    const navigate = useNavigate();
    
    // Function to handle form submission to firebase
    const handleSubmit = async (e) => {
        // Prevent default form submission behaviour
        // Stops the page from reloading whenever button is clicked
        e.preventDefault();

        // Regex for simple email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Validate email format
        if (!emailRegex.test(email)) {
            setErrorMessage('Invalid email address');
            return;
        }

        // Password match check
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }
        // Clear existing error messages
        setErrorMessage('');

        // For loading message
        // Initialise counter and loading messages
        let counter = 0;
        const loading_messages = ['Submitting.', 'Submitting..', 'Submitting...'];

        // Cycle messages to make an animation effect
        const intervalId = setInterval(() => {
            setErrorMessage(loading_messages[counter]);
            counter = (counter + 1) % 3;                // Cycle from 0 to 2
        }, 500);                                        // update every 500ms
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => { // on success, log the type of user
                user.setEmail(email)
                user.setIsRecruiter(false)
                user.setEventID("")
                
                setDoc(doc(db, 'studentProfiles', email), {
                            college: "",
                            fairs: [],
                            gpa: 0,
                            inQueue: false,
                            major: "",
                            name: "",
                            phone: "",
                            resume: "",
                            website: "",
                            year: ""
                        })
                    .then(() => { // redirect to /home after data logged
                        navigate('/home');
                    })
            })
            .catch((e) => { // handle sign-up errors
                clearInterval(intervalId)
                setErrorMessage(`Error creating account: ${e}`)
                }
            )
    }

    return (
        <div className={styles.studentRegisterContainer}>
          <Link to="/student-start" className={styles.backButton}>
            Back
          </Link>
          <h1 className={styles.title}>QueueMeIn</h1>
          <h2 className={styles.subTitle}>Student Sign Up</h2>
          <div className={styles.inputGroup}>
                <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                />
            </div>
            <div className={styles.inputGroup}>
                <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                />
            </div>
            <div className={styles.inputGroup}>
                <input
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.inputField}
                />
            </div>
            <div className={styles.inputGroup}>
                <button
                    onClick={handleSubmit}
                    className={styles.submitButton}
                >
                    Create Account
                </button>
            </div>
            <div className={styles.inputGroup}>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          </div>
        </div>
    );
}

export default StudentRegister;