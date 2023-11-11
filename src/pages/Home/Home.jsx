import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import React, { useState } from 'react';
import { db } from '../../firebase';
import { doc, onSnapshot, query, where, getDocs, addDoc, collection } from 'firebase/firestore';

import { useStore } from '../../store';

function Home() {
    const navigate = useNavigate();
    const [fairs, setFairs] = useState([])

    const unsubscribe = onSnapshot(collection(db, "fairs"), (snapshot) => {
        //console.log('Snapshot received from Firestore:', snapshot);

        const fairList = [];
        snapshot.forEach((doc) => {
            //console.log('Fair document:', doc.id, doc.data());
            fairList.push({ ...doc.data(), fairId: doc.id });
        });
        //console.log('Fairs list:', fairList);
        setFairs(fairList)
    });

    // Check if its a recruiter
    // pass fair id along for use later
    const isRecruiter = useStore((state) => state.isRecruiter);
    const handleViewEvent = (fairId) => {
        console.log('Navigating to event with fairId:', fairId);
        if (isRecruiter) {
            navigate('/CurrEventStudent', { state: { fairId } });
        } else {
            navigate('/current-event-company', { state: { fairId } });
        }
    };

    return (
        <div>
            <div className="flex justify-center">
                <NavBar />
            </div>

            <div className="mt-16 text-left">
                <h1 className="text-2xl font-bold">Current events:</h1>
                <div className="mt-4">
                    {fairs.map((fair, index) => (
                        <div key={index} className="bg-gray-200 p-4 rounded-md mb-4 relative">
                            <p className="text-xl">{fair.name}</p>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded absolute top-0 right-8 mt-2 mr-2"
                                onClick={() => handleViewEvent(fair.fairId)}
                            >
                                View Event
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
