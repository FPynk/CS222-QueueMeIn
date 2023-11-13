import React, { useState, useEffect } from 'react';
import { Box, Text, Textarea, Input, Button, VStack, Accordion,
         AccordionItem, AccordionButton, AccordionPanel, IconButton
} from '@chakra-ui/react';

import {
    DeleteIcon, ChevronDownIcon, ChevronUpIcon, AddIcon
} from '@chakra-ui/icons'

import { db } from '../../firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { userStore } from '../../store'
import NavBar from '../NavBar'

function JobListing(listing) {
    // listing {
    //      info: {title, industry, description, type, majors, years}
    //      deleteJob: function, deletes job in array
    //      update: function, updates job in array
    //      key: index in array
    // }
    // @listing.info may be undefined.  All other fields **MUST** be defined



    // If 'listing' has no 'info' parameters, fill with empty strings
    if(listing.info === undefined) {
        listing.info = { title: "", industry: "", description: "", type: "", majors: "", years: ""}
    }

    // local variable, used to condense instead of having title, industry, etc. as separate consts
    const [job, setJob] = useState({...listing.info})

    
    // called by onInput, updates local 'job' and job array.
    const updateJob = (newJob) => {
        setJob(newJob)
        listing.update(newJob)
    }

    // wrapped in arrow function to utilize isExpanded for icons
    return (
        <AccordionItem>
            {({isExpanded}) => (<div>
                <h2>
                    <AccordionButton>
                        <Box>
                            <IconButton colorScheme="blue" icon={(isExpanded)? (<ChevronUpIcon/>) : (<ChevronDownIcon/>)}/>
                        </Box>
                        <Box px={2}>
                            <Input 
                                placeholder="Job Title"
                                defaultValue={listing.info.title}
                                onInput={ (e) => updateJob( {...job, title: e.target.value} )}
                            />
                        </Box> 
                        <IconButton icon={<DeleteIcon/>} colorScheme="red" onClick={listing.deleteJob}/>
                    </AccordionButton>
                </h2>
                
                <AccordionPanel>
                    <VStack>
                        <Input 
                            placeholder="Job Industry"
                            defaultValue={listing.info.industry}
                            onInput={ (e) => updateJob( {...job, industry: e.target.value} )}
                        />
                        <Textarea 
                            placeholder="Job Description"
                            defaultValue={listing.info.description} resize="none"
                            onInput={ (e) => updateJob( {...job, description: e.target.value} )}
                        />
                        <Input 
                            placeholder="Job Type"
                            defaultValue={listing.info.type}
                            onInput={ (e) => updateJob( {...job, type: e.target.value} )}
                        />
                        <Input 
                            placeholder="Major Requirements"
                            defaultValue={listing.info.majors}
                            onInput={ (e) => updateJob( {...job, majors: e.target.value} )}
                        />
                        <Input
                            placeholder="Year Requirements"
                            defaultValue={listing.info.years}
                            onInput={ (e) => updateJob( {...job, years: e.target.value} )}
                        />
                    </VStack>
                </AccordionPanel>
            </div>)}
        </AccordionItem>
    );
}

function RecruiterProfile() {
    const user = userStore((state) => state)
    
    const [companyName, setCompanyName] = useState('')
    const [industry, setIndustry] = useState('')
    const [description, setDescription] = useState('')
    const [website, setWebsite] = useState('')
    const [recruiterName, setRecruiterName] = useState('')
    const [phone, setPhone] = useState('')
    const [jobs, setJobs] = useState([])
    
    const profileRef = doc(db, "recruiterProfiles", user.email)

    //fill in data from firebase, document is created on sign-up
    useEffect(() => {
        getDoc(profileRef) 
            .then((doc) => {
                let profile = doc.data()
                setCompanyName(profile.companyName)
                setIndustry(profile.industry)
                setDescription(profile.description)
                setWebsite(profile.website)
                setRecruiterName(profile.recruiterName)
                setPhone(profile.phone)
                setJobs(profile.jobs)
            })
    }, [])

    // adds empty job to jobs[], note rewriting array is significantly faster
    const createNewJob = () => {
        setJobs([...jobs, {}]);
    }

    // deletes job at index, again by rewriting entire array
    const deleteJob = (index) => {
        setJobs([...jobs.slice(0, index), ...jobs.slice(index + 1)]);
    }

    // rewite job at index
    const overwriteJob = (index, newJob) => {
        setJobs([...jobs.slice(0, index), newJob, ...jobs.slice(index  + 1)]);
    }

    const submitRecruiterPage = () => {
        updateDoc(profileRef, {
            companyName: companyName,
            industry: industry,
            description: description,
            website: website,
            recruiterName: recruiterName,
            phone: phone,
            jobs: jobs
        })
            .then(() => {
                alert("Your profile has been successfully updated.")
            })
    }

    return (
        <div className="h-screen flex flex-col items-center">
            <NavBar/>
            <Box className="app-container">
                <Text className="app-name center" align="center">Company Profile</Text>
                <VStack>
                    <Text className="header">Company Information</Text>
                    <VStack>
                        <Input placeholder="Company Name" defaultValue={companyName}
                            onInput={(e) => setCompanyName(e.target.value)}/>
                        <Input placeholder="Company Industry" defaultValue={industry}
                            onInput={(e) => {setIndustry(e.target.value)}}/>
                        <Textarea placeholder="Company Description" type="password" resize="none" defaultValue={description}
                            onInput={(e) => setDescription(e.target.value)}/>
                        <Input placeholder="Company Website" type="url" defaultValue={website}
                            onInput={(e) => setWebsite(e.target.value)}/>
                    </VStack>
                    <Text>Recruiter Information</Text>
                    <VStack>
                        <Input placeholder="Recruiter Name" defaultValue={recruiterName}
                            onInput={(e) => setRecruiterName(e.target.value)}/>
                        <Input placeholder="Recruiter Phone" type="tel" defaultValue={phone}
                            onInput={(e) => setPhone(e.target.value)}/>
                    </VStack>
                    <Text>Available Positions</Text>
                    <Accordion allowMultiple="true">
                        {jobs.map((item, index) => 
                            <JobListing key={index} info={item} deleteJob={() => deleteJob(index)}
                                update={(newJob) => overwriteJob(index, newJob)}/>
                        )}
                        <AccordionItem>
                            <AccordionButton>
                                <IconButton icon={<AddIcon/>} colorScheme="yellow" onClick={createNewJob}/>
                                <Box px={2}>
                                    <Input value="Add Position" textAlign="center" variant="unstyled"/>
                                </Box>
                            </AccordionButton>
                        </AccordionItem>
                    </Accordion>
                    <Button px="85px" colorScheme="green" onClick={() => submitRecruiterPage()}>Update Profile</Button>
                </VStack>
            </Box>
        </div>
    );
}

export default RecruiterProfile;