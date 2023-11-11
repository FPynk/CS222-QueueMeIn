import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import { db } from '../../firebase';
import { query, where, getDocs, addDoc, collection } from 'firebase/firestore';

// Replace map with data from firebase
const sampleEvents = [
    "Event 1: This is the first event",
    "Event 2: This event happens after event 1",
    "Event 3: This event occurs last",
];

function Home() {
    const navigate = useNavigate();
    const [isRecruiter, setIsRecruiter] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const q = query(usersCollection, where('recruiter', '==', true));
                const snapshot = await getDocs(q);

                snapshot.forEach(doc => {
                    const user = doc.data();
                    console.log(user);
                    setIsRecruiter(true);
                });
            } catch (error) {
                console.error("Error querying database:", error);
            }
        };
        fetchData();
    }, []);

    const handleViewEvent = () => {
        if (isRecruiter) {
            navigate('/current-event-company');
        } else {
            navigate('/CurrEventStudent');
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
                    {sampleEvents.map((event, index) => (
                        <div key={index} className="bg-gray-200 p-4 rounded-md mb-4 relative">
                            <p className="text-xl">{event}</p>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded absolute top-0 right-8 mt-2 mr-2"
                                onClick={handleViewEvent}
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
