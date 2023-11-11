import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Text, Button, Flex, Spacer, Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react';
import { db } from '../../firebase';
import { query, where, getDocs, addDoc, collection } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import CurrEventStudent from './CurrEventStudent.module.css'; // Import the styles
import { useLocation } from 'react-router-dom';

function StudentView() {
    // grab fair ID to grab info ltr
    const location = useLocation();
    const { fairId } = location.state;

    // State to manage the company currently in the queue
    const [currentCompany, setCurrentCompany] = useState(null);

    // State to manage the number of people ahead in the queue for that company
    const [queueCount, setQueueCount] = useState(0);

    // State to manage the list of companies
    const [companies, setCompanies] = useState([]);

    // Fetch companies from the backend when the component mounts
    useEffect(() => {
        const fetchCompanies = async () => {
            const companiesCollectionRef = collection(db, "fairs", fairId, "companies");
            const snapshot = await getDocs(companiesCollectionRef);
            const companiesList = snapshot.docs.map(doc => doc.data());
            setCompanies(companiesList);
        };
    
        if (fairId) {
            fetchCompanies();
        }
    }, [fairId]);
    // TODO BACKEND: UPDATE QUEUE STATUS/ DATA
    // Function to handle when "Add Me" or "Remove Me" is clicked
    const handleQueue = (index) => {
        // TODO BACKEND: Add logic to enqueue and dequeue the student to this company on the backend
        // This should also set the number of people in the queue
        if (currentCompany === null) {
        setCurrentCompany(index);
        } else if (currentCompany === index) {
        setCurrentCompany(null);
        setQueueCount(Math.floor(Math.random() * 10));
        }
    }
    
    // Function to update the queue count (can be called when backend updates)
    const updateQueueCount = (newCount) => {
        // TODO BACKEND: Update the queue count based on backend data
        setQueueCount(newCount);
    };

    return (
        <ChakraProvider>
        <Box>
            <Flex className={CurrEventStudent.navbar} alignItems="center">
            <Text>QueueMeIn</Text>
            <Spacer />
            {/* TODO FRONTEND: LINK TO RESPECTIVE PAGES */}
            <Button mx={2}>Home</Button>
            <Button mx={2}>Profile</Button>
            <Button mx={2}>Log out</Button>
            </Flex>

            <Box className={CurrEventStudent.mainBody}>
            <Text fontSize="2xl" mb={4}>Available Companies</Text>
            {/* Accordian to vertically stack companies and allow for dropdown for qualifications */}
            <Accordion allowMultiple>
                {/* BACKEND TODO: UPDATE COMPANY INFO */}
                {companies.map((_, index) => (
                <AccordionItem key={index}>
                    <h2>
                    <AccordionButton>
                        <Box flex="1" textAlign="left">
                        Company {index + 1}
                        </Box>
                        {/* Queue Status Display */}
                        {currentCompany  === index && 
                        <Text mr = {4}>
                            {queueCount === 0 ? 'You are Up' : `${queueCount} people in front`}
                        </Text>
                        }
                        {/* Button to add/ remove to Queue */}
                        {/* BACKEND TODO: UPDATE QUEUE STATUS/ DATA */}
                        <Button 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); handleQueue(index); }}
                        isDisabled={currentCompany !== null && currentCompany !== index}
                        >
                        {currentCompany  === index ? 'Remove Me' : 'Add Me'}
                        </Button>
                    </AccordionButton>
                    </h2>
                    {/* Dropdown section to show qualifications */}
                    {/* BACKEND TODO: EXTRACT QUALIFICATION DATA */}
                    <AccordionPanel>
                    <Text>
                        Qualification 1, Qualification 2
                    </Text>
                    </AccordionPanel>
                </AccordionItem>
                ))}
            </Accordion>
            </Box>
        </Box>
        </ChakraProvider>
    );
}

export default StudentView;