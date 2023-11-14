import React, { useState, useEffect, useRef } from 'react';
import { Center, ChakraProvider, Box, Text, Input, Button, VStack, IconButton } from '@chakra-ui/react';
import { db } from '../../firebase';
import { query, where, getDocs, addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar';

import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from '@chakra-ui/react'
import { AccordionActions } from '@mui/material';


import {
    Textarea, Breadcrumb, BreadcrumbItem,
    Accordion, AccordionItem, AccordionPanel, AccordionButton
} from '@chakra-ui/react';

import {
    DeleteIcon, ChevronDownIcon, ChevronUpIcon, AddIcon
} from '@chakra-ui/icons'


function StudentProfile(info) {

    const [studentName, setStudentName] = useState('')
    const [college, setCollege] = useState('')
    const [year, setYear] = useState('')
    const [major, setMajor] = useState('')
    const [gpa, setGpa] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [websiteLink, setWebsiteLink] = useState('')

    // const profileRef = doc(db,"studentProfiles", info.email)


    // useEffect(() => {
    //     getDoc(profileRef)
    //         .then((doc) => {
    //             let profile = doc.data()
    //             setStudentName(profile.studentName)
    //             setCollege(profile.college)
    //             setYear(profile.year)
    //             setMajor(profile.major)
    //             setGpa(profile.gpa)
    //             setEmail(profile.email)
    //             setPhoneNumber(profile.phoneNumber)
    //             setWebsiteLink(profile.websiteLink)
    //         })
    // }, [])

    // const submitStudentPage = () => {
    //     updateDoc(profileRef, {
    //         studentName: studentName,
    //         college: college,
    //         year: year,
    //         major: major,
    //         gpa: gpa,
    //         email: email,
    //         phoneNumber: phoneNumber,
    //         websiteLink: websiteLink
    //     })
    //     .then(() => {
    //         alert("profile updated")
    //     })
    // }

  return (

    <div>
        <div className="flex justify-center">
            <NavBar/>
        </div>
      <Center > <Text fontSize='50px'>Student Profile </Text> </Center>

{/*BASIC INFORMATION SECTION */}
      <Center h='50px' color='slate'>
        <Text fontSize='20'>Basic Information</Text>
      </Center>

    

    <VStack>
        <Input placeholder="Name"  />
            {/* // onInput={(e) => setStudentName(e.target.value)}/> */}
        <Input placeholder="College" />
            {/* // onInput={(e) => setChone(e.target.value)}/> */}
        <Input placeholder="Year" />
        {/* // onInput={(e) => setYear(e.target.value)}/> */}
        <Input placeholder="Major" />
        {/* // onInput={(e) => setMajor(e.target.value)}/> */}
        <Input placeholder="GPA" />
        {/* // onInput={(e) => setGpa(e.target.value)}/> */}
        <Input placeholder="Resume" />
        {/* // onInput={(e) => setResume(e.target.value)}/> */}
    </VStack>


{/*CONTACT INFORMATION SECTION */}
      <Center h='50px' color='slate'>
        <Text fontSize='20'>Contact Information</Text>
      </Center>

      <VStack>
        <Input placeholder="Email" />
        {/* // onInput={(e) => setEmaile(e.target.value)}/> */}
        <Input placeholder="Phone Number" />
            {/* // onInput={(e) => setPhoneNumber(e.target.value)}/> */}
        <Input placeholder="Website Link" />
            {/* // onInput={(e) => setWebsite(e.target.value)}/> */}
      </VStack>

    </div>
  );
}

export default StudentProfile;
