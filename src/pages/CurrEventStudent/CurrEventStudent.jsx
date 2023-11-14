import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Text, Button, Flex, Spacer, Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react';
import { db } from '../../firebase';
import { query, where, getDocs, addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
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
            for (const email of companyEmails) {
                if (!email) {
                    console.log("Undefined email encountered");
                    continue;
                }
                const profile = await fetchRecruiterProfile(email);
                if (profile) {
                    profiles.push({ id: email, ...profile }); // Include the email (document ID) in the profile object
                }
            }
            setRecruiterProfiles(profiles);
        };
    
        if (companyEmails && companyEmails.length > 0) {
            fetchAllRecruiterProfiles();
        }
    }, [companyEmails]); // Re-run when companyEmails changes
    
    // Function to update the queue count (can be called when backend updates)
    const handleQueue = async (email, index) => {
        console.log("Email:", email);
        const companyDocRef = doc(db, "recruiterProfiles", email);
    
        try {
            const companyDoc = await getDoc(companyDocRef);
            if (!companyDoc.exists()) {
                console.log(`No company found with email: ${email}`);
                return;
            }
    
            let updatedQueue = companyDoc.data().queue || [];
            const studentEmail = "student@example.com"; // Replace with the actual student's email
    
            if (updatedQueue.includes(studentEmail)) {
                updatedQueue = updatedQueue.filter(e => e !== studentEmail); // Remove student from queue
            } else {
                updatedQueue.push(studentEmail); // Add student to queue
            }
            console.log("Before update - currentCompany:", currentCompany, "index:", index);
            console.log("Conditional", currentCompany === index);
            // Toggle currentCompany state
            if (currentCompany === index) {
                setCurrentCompany(null); // Remove from queue
            } else {
                setCurrentCompany(index); // Add to queue
            }
            await updateDoc(companyDocRef, { queue: updatedQueue });
            setQueueCount(updatedQueue.length);
            console.log("After update - currentCompany:", currentCompany);
        } catch (error) {
            console.error("Error updating queue: ", error);
        }
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
                            {queueCount <= 1 ? 'You are Up' : `${queueCount - 1} people in front`}
                        </Text>
                        }
                        {/* Button to add/ remove to Queue */}
                        {/* BACKEND TODO: UPDATE QUEUE STATUS/ DATA */}
                        <Button 
                        size="sm" 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            handleQueue(profile.id, index); 
                        }}
                        isDisabled={currentCompany !== null && currentCompany !== index}
                        >
                        {currentCompany === index ? 'Remove Me' : 'Add Me'}
                        </Button>
                    </AccordionButton>
                    </h2>
                    {/* Dropdown section to show qualifications */}
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