import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import styles from './App.module.css';

import Home from './pages/Home/Home';
import StudentStart from './pages/StudentStart/StudentStart';
import RecruiterStart from './pages/RecruiterStart/RecruiterStart';
import RecruiterRegister from './pages/RecruiterRegister/RecruiterRegister';
import StudentRegister from './pages/StudentRegister/StudentRegister';
import CurrEventStudent from './pages/CurrEventStudent/CurrEventStudent';
import RecruiterQueue from './pages/RecruiterQueue/RecruiterQueue';
import StudentProfile from './pages/StudentProfile/StudentProfile';


function App() {
    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <div className={styles['container']}>
                            <h1 className={styles['welcome-text']}>Welcome to QueueMeIn</h1>
                            <p className={styles['sub-text']}>What are you?</p>
                            
                            <Link to="/student-start">
                                <button className={styles['btn'] + ' ' + styles['btn-red']}>
                                    Student
                                </button>
                            </Link>
    
                            <Link to="/recruiter-start">
                                <button className={styles['btn'] + ' ' + styles['btn-blue']}>
                                    Recruiter
                                </button>
                            </Link>

                            <Link to="/recruiter-queue">
                                <button className={styles['btn'] + ' ' + styles['btn-blue']}>
                                    Temporary Recruiter Queue
                                </button>
                            </Link>

                            <Link to="/student-profile">
                                <button className={styles['btn'] + ' ' + styles['btn-blue']}>
                                    Temporary Student Profile
                                </button>
                            </Link>


                        </div>
                    } />
                    <Route path="/student-profile" element={<StudentProfile />} />
                    <Route path="/recruiter-queue" element={<RecruiterQueue />} />
                    <Route path="/student-start" element={<StudentStart />} />
                    <Route path="/student-register" element={<StudentRegister />} />
                    <Route path="/recruiter-start" element={<RecruiterStart />} />
                    <Route path="/recruiter-register" element={<RecruiterRegister />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/CurrEventStudent" element={<CurrEventStudent />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;

