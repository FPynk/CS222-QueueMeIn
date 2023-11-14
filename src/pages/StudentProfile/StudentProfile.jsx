import React, { useState, useEffect, useRef } from 'react';
import { Center, ChakraProvider, Box, Text, Input, Button, VStack, IconButton } from '@chakra-ui/react';
import { db } from '../../firebase';
import { query, where, getDocs, addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

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

import { userStore } from '../../store'

import NavBar from '../NavBar'


function StudentProfile() {

  const user = userStore((state) => state)

    const [name, setName] = useState('')
    const [college, setCollege] = useState('')
    const [year, setYear] = useState('')
    const [major, setMajor] = useState('')
    const [gpa, setGpa] = useState('')
    const [resume, setResume] = useState('')
    const [phone, setPhone] = useState('')
    const [website, setWebsite] = useState('')
    

    const studentProfileRef = doc(db,"studentProfiles", user.email)


    useEffect(() => {
        getDoc(studentProfileRef)
            .then((doc) => {
                let profile = doc.data()
                setName(profile.name)
                setCollege(profile.college)
                setYear(profile.year)
                setMajor(profile.major)
                setGpa(profile.gpa)
                setPhone(profile.phone)
                setWebsite(profile.website)
                setResume(profile.resume)
            })
    }, [])

    const submitStudentPage = () => {
        updateDoc(studentProfileRef, {
            name: name,
            college: college,
            year: year,
            major: major,
            gpa: gpa,
            phone: phone,
            website: website,
            resume: resume,
            phone: phone,
            website: website
        })
        .then(() => {
            alert("profile updated")
        })
    }

  return (

    <div>
      <Center><NavBar></NavBar></Center>
      <Center > <Text fontSize='50px'>Student Profile </Text> </Center>

{/*BASIC INFORMATION SECTION */}
      <Center h='50px' color='slate'>
        <Text fontSize='20'>Basic Information</Text>
      </Center>

    

    <VStack>
        <Input placeholder="Name" defaultValue={name}  
          onInput={(e) => setName(e.target.value)}/>
        <Input placeholder="College" defaultValue={college}
          onInput={(e) => setCollege(e.target.value)}/>
        <Input placeholder="Year" defaultValue={year}
          onInput={(e) => setYear(e.target.value)}/> 
        <Input placeholder="Major" defaultValue={major}
          onInput={(e) => setMajor(e.target.value)}/> 
        <Input placeholder="GPA" defaultValue={gpa}
          onInput={(e) => setGpa(e.target.value)}/> 
        <Input placeholder="Resume" defaultValue={resume}
          onInput={(e) => setResume(e.target.value)}/>
    </VStack>


{/*CONTACT INFORMATION SECTION */}
      <Center h='50px' color='slate'>
        <Text fontSize='20'>Contact Information</Text>
      </Center>

      <VStack>
        <Input placeholder="Phone Number" defaultValue={phone}
          onInput={(e) => setPhone(e.target.value)}/> 
        <Input placeholder="Website Link" defaultValue={website}
          onInput={(e) => setWebsite(e.target.value)}/> 
      </VStack>

      <Center> <Button px="85px" colorScheme="green" onClick={() => submitStudentPage()}>Update Profile</Button> </Center>

    </div>
  );
}

export default StudentProfile;