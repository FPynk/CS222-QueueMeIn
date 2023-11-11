import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';

import Home from './pages/Home';
import StudentStart from './pages/StudentStart/StudentStart';
import RecruiterStart from './pages/RecruiterStart/RecruiterStart';
import RecruiterRegister from './pages/RecruiterRegister/RecruiterRegister';
import StudentRegister from './pages/StudentRegister/StudentRegister';
import CurrEventStudent from './pages/CurrEventStudent/CurrEventStudent';
import CurrentEventCompany from './pages/CurrEventCompany/CurrEventCompany';

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <div className="container">
                            <h1 className="welcome-text">Welcome to QueueMeIn</h1>
                            <p className="sub-text">What are you?</p>
                            
                            <Link to="/student-start">
                                <button className="btn btn-red">
                                    Student
                                </button>
                            </Link>

                            <Link to="/recruiter-start">
                                <button className="btn btn-blue">
                                    Recruiter
                                </button>
                            </Link>
                        </div>
                    } />
                    <Route path="/student-start" element={<StudentStart />} />
                    <Route path="/student-register" element={<StudentRegister />} />
                    <Route path="/recruiter-start" element={<RecruiterStart />} />
                    <Route path="/recruiter-register" element={<RecruiterRegister />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/CurrEventStudent" element={<CurrEventStudent />} />
                    <Route path="/current-event-company" element={<CurrentEventCompany />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;

