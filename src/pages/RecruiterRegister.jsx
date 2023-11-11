import React, { useState } from 'react';
import { ChakraProvider, Box, Text, Input, Button, VStack } from '@chakra-ui/react';
import { db } from '../firebase';
import { query, where, getDocs, addDoc, collection } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../page_css/RecruiterRegister.css';  // Importing your external CSS

function RecruiterRegister() {
    // State variables to hold form inputs like email, password, confirmpassword
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Delay function for debugging
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
    
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

        // Firestore query to check if the email already exists
        // Personal notes explains in detail
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        // Check if email exists
        if (!querySnapshot.empty) {
            setErrorMessage("Account already exists");
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

        // Sending data to firestore
        try {
            await addDoc(collection(db, "users"), {
                email,
                password,
                recruiter: true,
            });

            // Debugging purposes
            // await sleep(5000);

            // Clear loading message and set success message
            clearInterval(intervalId);
            setErrorMessage("Account created successfully!");

            // Clear fields once done
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            // Redirect to home page
            window.location.href = '/home'; // Hard-coded redirect to home page
        } catch (e) {
            // Clear loading message and set error message
            clearInterval(intervalId);
            setErrorMessage("Error creating account: ${e}");
        }
    }

    return (
        <ChakraProvider>
            <Box className="recruiterRegisterContainer">
                <Link to="/recruiter-start" className="backButton">
                    Back
                </Link>
                <Text className="title">QueueMeIn</Text>
                <Text className="subTitle">Recruiter Sign Up</Text>
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

export default RecruiterRegister;

/* PERSONAL NOTES
1) Firestore query: const q = query(collection(db, 'users'), where('email', '==', email));

collection(db, 'users') 
=> users collection in firestore db instance

where('email', '==', email) 
=> query condition, looks for documents where 'email' field is == to email variable of user

query(...)
=> combines collection and query condition to create a complete query

const querySnapshot = await getDocs(q);
=> executes query against firestore database and returns snapshot
=> await since async operation
=> querySnapshot contains all documents that match query criteria at that pt in time
=> can access do

EXAMPLE: EXTRACTING DATA FROM QUERY
if (!querySnapshot.empty) {
  const firstDocData = querySnapshot.docs[0].data();
  const emailField = firstDocData.email;
  console.log("Email from first document:", emailField);
} else {
  console.log("No documents found");
}
=> how to access specific fields in a doc, use forEach() to iterate through all docs

*/