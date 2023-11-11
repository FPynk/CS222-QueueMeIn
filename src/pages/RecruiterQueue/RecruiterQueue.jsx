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

import './RecruiterQueue.css';

import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from "@mui/material";



function RecruiterQueue() {

    const [open,SetOpen] = useState(false);

    return (
        <div className="container">
                <h1 className="title-text">Queue</h1>
                <p className="label-text">Current Student:</p>
                
                <div class='parent'>
                    <div class='child'>Name</div>
                    <div class='child'>
                        <div>
                            <Button onClick={() => SetOpen(true)}> Student Information </Button>
                            <Dialog open={open} OnClose={()=>SetOpen(false)}>
                                <DialogTitle>Name</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        <h1>Major</h1>
                                        <h1>Year</h1>
                                        <h1>Resume</h1>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={()=> SetOpen(false)}> Done </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                </div>

                <p className="label-text">5 students waiting:</p>
                <Center>
                    <button className="alert-button"> Alert next student </button>
                </Center>
        </div>
    )
}
export default RecruiterQueue;