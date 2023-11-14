import React, { useState } from 'react';
import NavBar from '../NavBar';

function CurrEventCompany() { // Purely for testing
    const [queue, setQueue] = useState([
        {
            name: 'Bob Bobby',
            major: 'Computer Science',
            year: 'Junior',
            resume: 'Sample resume content',
        },
        {
            name: 'Joe Mama',
            major: 'Mathematics',
            year: 'Sophomore',
            resume: 'Another sample resume',
        },
        {
            name: 'Lastin Que',
            major: 'Engineering',
            year: 'Senior',
            resume: 'One more sample resume',
        },
    ]);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

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
            <NavBar />
            <div className="mt-4">
                <h1 className="text-3xl font-semibold text-center">Current Student:</h1>
                {queue.length > 0 ? (
                    <div className="bg-gray-100 p-4 rounded-md cursor-pointer" onClick={() => showStudentStats(currentStudentIndex)}>
                        <h2 className="text-lg font-semibold">{queue[currentStudentIndex].name}</h2>
                        {currentStudentIndex === null ? null : (
                            <div>
                                <p>Major: {queue[currentStudentIndex].major}</p>
                                <p>Year: {queue[currentStudentIndex].year}</p>
                                <p>Resume: {queue[currentStudentIndex].resume}</p>
                            </div>
                        )}
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