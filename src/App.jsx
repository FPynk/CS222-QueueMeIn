import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import styles from './App.module.css';
import { userStore } from "./store"

import Home from './pages/Home/Home';
import StudentStart from './pages/StudentStart/StudentStart';
import RecruiterStart from './pages/RecruiterStart/RecruiterStart';
import RecruiterRegister from './pages/RecruiterRegister/RecruiterRegister';
import RecruiterProfile from './pages/RecruiterProfile/RecruiterProfile';
import StudentRegister from './pages/StudentRegister/StudentRegister';
import StudentProfile from './pages/StudentProfile/StudentProfile';
import CurrEventStudent from './pages/CurrEventStudent/CurrEventStudent';
import CurrEventCompany from './pages/CurrEventCompany/CurrEventCompany';

function App() {
    const user = userStore((state) => state)

    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <div className={styles.container}>
                            <h1 className={styles['welcome-text']}>Welcome to QueueMeIn</h1>
                            <p className={styles['sub-text']}>What are you?</p>
                            
                            <div align="center">
                                <Link to="/student-start">
                                    <button className={styles['btn'] + ' ' + styles['btn-red']}>
                                        Student
                                    </button>
                                </Link>
                                <p className={styles['small-space']}>&nbsp;</p>
                                <Link to="/recruiter-start">
                                    <button className={styles['btn'] + ' ' + styles['btn-blue']}>
                                        Recruiter
                                    </button>
                                </Link>
                            </div>
                        </div>
                    } />
                    <Route path="/student-start" element={<StudentStart />} />
                    <Route path="/student-register" element={<StudentRegister />} />
                    <Route path="/recruiter-start" element={<RecruiterStart />} />
                    <Route path="/recruiter-register" element={<RecruiterRegister />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/current-event" element={(user.isRecruiter)?
                        <CurrEventCompany/> : <CurrEventStudent />} />
                    <Route path="/profile" element={(user.isRecruiter)?
                        <RecruiterProfile /> : <StudentProfile />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;