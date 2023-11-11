import React, { useState } from 'react';
import { ChakraProvider, Box, Text, Input, Button, VStack } from '@chakra-ui/react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { useStore } from '../../store';

import './StudentRegister.css';  // Importing your external CSS

function StudentRegister() {
    // State variables to hold form inputs like email, password, confirmpassword
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    // Fucntion to handle form submission to firebase
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
                useStore.getState().setEmail(email);
                useStore.getState().setIsRecruiter(false);
                useStore.getState().setCurrentEventID("");
                
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
                        window.location.href = '/home';
                    })
            })
            .catch((e) => { // handle sign-up errors
                clearInterval(intervalId)
                setErrorMessage(`Error creating account: ${e}`)
                }
            )
    }

    return (
        <ChakraProvider>
            <Box className="studentRegisterContainer">
                <Link to="/student-start" className="backButton">
                    Back
                </Link>
                <Text className="title">QueueMeIn</Text>
                <Text className="subTitle">Student Sign Up</Text>
                <VStack spacing={4} className="inputGroup">
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="inputField"
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="inputField"
                    />
                    <Input
                        placeholder="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="inputField"
                    />
                    <Button
                        onClick={handleSubmit}
                        className="submitButton"
                    >
                        Create Account
                    </Button>
                    {errorMessage && <Text className="errorMessage">{errorMessage}</Text>}
                </VStack>
            </Box>
        </ChakraProvider>
    );
}

export default StudentRegister;