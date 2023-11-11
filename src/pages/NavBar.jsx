import { Link } from "react-router-dom";
import { ChakraProvider, Breadcrumb, BreadcrumbItem, Box, Text, Button } from "@chakra-ui/react";
import { auth, db } from "../firebase.js"
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { signOut } from "firebase/auth"

// Removes student from queue if in queue
function leaveQueue(email) {
    // logic:
    // access student profile, check if in queue
    // if so, access the currentQueue in recruiterProfiles, and delete themselves
    // update inQueue = false

    getDoc(doc(db, "studentProfiles", email))
        .then((stu) => {
            if(!(stu.data() == undefined)) { // are a student
                if(stu.data().inQueue) {
                    let recEmail = stu.data().currentQueue();
                    getDoc(doc(db, "recruiterProfiles", recEmail))
                        .then((rec) => {
                            const newQueue = rec.data().queue
                                .filter(id => id !== email);
                            
                            updateDoc(doc(db, "recruiterProfiles", recEmail), {queue: newQueue})
                        })
                    updateDoc(doc(db, "studentProfiles", email), {inQueue: false})
                }
            }
        })
        .catch(e => {
            alert(e)
        })
}

// If defined, unsubscribe() is called.  Designed for pages to
// unsubscribe from firebase snapshots before leaving the page.
function userLogOut(unsubscribe, email) {
    leaveQueue(email)
    signOut(auth)
        .then(() => { //on success
            if(!(unsubscribe === undefined)) {
                unsubscribe()
            }
            window.location.href = '/' //back to start of application
        })
        .catch((e) => {
            // should never fail, but alert displayed to user
            alert(e)
        })
}

// unsubscribe={() => {}} can be passed in.  Used by pages who must unsub before leaving
// email="student@illinois.edu" **MUST** be passed in.  Used to remove student from active queue.
function NavBar(info) {
    return (
        <ChakraProvider>
            <Box className="app-container">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Text fontSize='3xl'>QueueMeIn</Text>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <Link to="/home"><Button colorScheme='blue'>Home</Button></Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <Link to="/profile"><Button colorScheme='blue'>Profile</Button></Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <Button onClick={() => {userLogOut(info.unsubscribe, info.email)}} colorScheme='red' >Logout</Button>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Box>
        </ChakraProvider>
    );
}

export default NavBar;