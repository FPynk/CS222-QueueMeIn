import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { userStore } from '../../store';

const CurrEventCompany = () => {
    const [currentStudent, setCurrentStudent] = useState(null);
    const recruiterEmail = userStore((state) => state.email);

    useEffect(() => {
        const fetchQueue = async () => {
            const recruiterRef = doc(db, 'recruiterProfiles', recruiterEmail);
            const recruiterDoc = await getDoc(recruiterRef);

            if (recruiterDoc.exists()) {
                const queue = recruiterDoc.data().queue || [];

                if (queue.length > 0) {
                    const currentStudentEmail = queue[0];
                    const studentRef = doc(db, 'studentProfiles', currentStudentEmail);
                    const studentDoc = await getDoc(studentRef);
                    if (studentDoc.exists()) {
                        const studentData = studentDoc.data();
                        setCurrentStudent(studentData);
                    } else {
                        setCurrentStudent(null);
                    }
                } else {
                    setCurrentStudent(null);
                }
            } else {
                setCurrentStudent(null);
            }
        };

        fetchQueue();
    }, []);

    const handleFinish = async () => {
        const recruiterRef = doc(db, 'recruiterProfiles', recruiterEmail);
        const recruiterDoc = await getDoc(recruiterRef);

        if (recruiterDoc.exists()) {
            await updateDoc(recruiterRef, {
                queue: arrayRemove(recruiterDoc.data().queue[0])
            });
            const updatedRecruiterDoc = await getDoc(recruiterRef);
            if (updatedRecruiterDoc.exists()) {
                const updatedQueue = updatedRecruiterDoc.data().queue || [];
                if (updatedQueue.length > 0) {
                    const newCurrentStudentEmail = updatedQueue[0];
                    const newStudentRef = doc(db, 'studentProfiles', newCurrentStudentEmail);
                    const newStudentDoc = await getDoc(newStudentRef);
                    if (newStudentDoc.exists()) {
                        const newStudentData = newStudentDoc.data();
                        setCurrentStudent(newStudentData);
                    } else {
                        setCurrentStudent(null);
                    }
                } else {
                    setCurrentStudent(null);
                }
            } else {
                setCurrentStudent(null);
            }
        } else {
            setCurrentStudent(null);
        }
    };

    return (
        <div>
            <div className="flex justify-center">
                <NavBar />
            </div>

            <div className="flex justify-center mt-4">
                {currentStudent ? (
                    <div className="text-center p-4 border border-gray-300 rounded-lg text-lg">
                        <h1 className="font-bold text-2xl mb-4">Current Student: {currentStudent.name}</h1>
                        <p>College: {currentStudent.college}</p>
                        <p>GPA: {currentStudent.gpa}</p>
                        <p>Major: {currentStudent.major}</p>
                        <p>Phone: {currentStudent.phone}</p>
                        <p>Resume: {currentStudent.resume}</p>
                        <p>Website: {currentStudent.website}</p>
                        <p>Year: {currentStudent.year}</p>
                    </div>
                ) : (
                    <div className="text-center p-4 border border-gray-300 rounded-lg text-lg">
                        <h1 className="font-bold text-2xl mb-4">No students in queue.</h1>
                    </div>
                )}
            </div>

            <div className="flex justify-center mt-4">
                <button
                    onClick={handleFinish}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    disabled={!currentStudent}
                >
                    Finish
                </button>
            </div>
        </div>
    );
};

export default CurrEventCompany;
