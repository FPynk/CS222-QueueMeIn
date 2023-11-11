import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Text, Button, Flex, Spacer, Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react';
import { db } from '../../firebase';
import { query, where, getDocs, addDoc, collection, doc, getDoc } from 'firebase/firestore';
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

    // State to manage the list of companies for email
    const [companyEmails, setCompanyEmails] = useState([]);

    // states to track profiles
    const [recruiterProfiles, setRecruiterProfiles] = useState([]);

    // Fetch companies from the backend when the component mounts
    useEffect(() => {
        const fetchCompanies = async () => {
            console.log(`Fetching companies for fair with ID: ${fairId}`);
    
            if (!fairId) {
                console.log('No fairId provided');
                return;
            }
    
            const fairDocRef = doc(db, "fairs", fairId);
            try {
                const fairDoc = await getDoc(fairDocRef);
                if (!fairDoc.exists()) {
                    console.log(`No fair found with ID: ${fairId}`);
                    return;
                }
    
                const fairData = fairDoc.data();
                console.log(`Fair data for ${fairId}: `, fairData);
    
                const companiesList = fairData.companies || [];
                console.log('Companies fetched: ', companiesList);
                setCompanyEmails(companiesList);
            } catch (error) {
                console.error('Error fetching fair data: ', error);
            }
        };
    
        fetchCompanies();
    }, [fairId]);
    
    const fetchRecruiterProfile = async (email) => {
        const docRef = doc(db, "recruiterProfiles", email);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching recruiter profile: ", error);
        }
        return null;
    };
    
    useEffect(() => {
        const fetchAllRecruiterProfiles = async () => {
            const profiles = [];
            for (const email of companyEmails) { // Assume companyEmails is an array of emails
                const profile = await fetchRecruiterProfile(email);
                if (profile) {
                    profiles.push(profile);
                }
            }
            console.log("All fetched profiles: ", profiles);
            // Set the profiles to state, or handle them as needed
            setRecruiterProfiles(profiles);
        };
    
        if (companyEmails && companyEmails.length > 0) {
            fetchAllRecruiterProfiles();
        }
    }, [companyEmails]); // Re-run when companyEmails changes
    
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
                {recruiterProfiles.map((profile, index) => (
                <AccordionItem key={index}>
                <h2>
                    <AccordionButton>
                        <Box flex="1" textAlign="left">
                            {profile.companyName}
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
                        <Text>Description: {profile.description}</Text>
                        <Text>Industry: {profile.industry}</Text>
                        <Text>Phone: {profile.phone}</Text>
                        <Text>Recruiter: {profile.recruiterName}</Text>
                        <Text>Website: {profile.website}</Text>
                        {/* Displaying Jobs */}
                        <Text> Job List: </Text>
                        {profile.jobs.map((job, jobIndex) => (
                        <Box key={jobIndex} p={2} borderWidth="1px" borderRadius="lg">
                            <Text>Title: {job.title}</Text>
                            <Text>Type: {job.type}</Text>
                            <Text>Industry: {job.industry}</Text>
                            <Text>Majors: {job.majors}</Text>
                            <Text>Years: {job.years}</Text>
                            <Text>Description: {job.description}</Text>
                        </Box>
                        ))}
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