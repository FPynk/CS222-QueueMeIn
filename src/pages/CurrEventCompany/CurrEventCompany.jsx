import React, { useState, useEffect} from 'react';
import NavBar from '../NavBar';
import { db } from '../../firebase';
import { doc, getDoc, onSnapshot, query, where, getDocs, addDoc, collection } from 'firebase/firestore';
import { userStore } from '../../store';


const CurrEventCompany = () => {
    const fairId = userStore((state) => state.eventID);
    const [queue, setQueue] = useState([]);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

    const getStudentProfile = async (email) => {
        const docRef = doc(db, "studentProfiles", email);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching student profile: ", error);
        }
        return null;
    };

    const removeCurrentStudent = () => {
        if (queue.length > 0) {
            const updatedQueue = [...queue];
            updatedQueue.splice(currentStudentIndex, 1);
            if (currentStudentIndex === queue.length - 1) {
                setCurrentStudentIndex(0);
            } else {
                setCurrentStudentIndex(currentStudentIndex);
            }
            setQueue(updatedQueue);
        } else {
            setCurrentStudentIndex(null);
        }
    };

    const showStudentStats = (index) => {
        setCurrentStudentIndex(index);
    };

    return (
        <div className="h-screen flex flex-col items-center">
            <NavBar/>
            <div className="mt-4">
                <h1 className="text-3xl font-semibold text-center">Current Student:</h1>
                {queue.length > 0 ? (
                    <div className="bg-gray-100 p-4 rounded-md cursor-pointer" onClick={() => showStudentStats(currentStudentIndex)}>
                            <div>
                                {queue.map(item => (
                                    <div key={item.name}>
                                    <p>Name: {item.name}</p>
                                    <p>Major: {item.major}</p>
                                    <p>Grade: {item.year}</p>
                                    <p>Resume: {item.resume}</p>
                                    </div>
                                ))}
                            </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 p-4 rounded-md cursor-pointer" onClick={() => showStudentStats(null)}>
                        <h2 className="text-lg font-semibold">Currently no students in Queue</h2>
                    </div>
                )}
            </div>
            <div className="mt-4">
                <button
                    onClick={removeCurrentStudent}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                    Finish
                </button>
            </div>
        </div>
    );
}

export default CurrEventCompany;