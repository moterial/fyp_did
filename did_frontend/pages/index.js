import React,{ useEffect, useState} from 'react'
import { Box, Heading, Text, Button, Flex, Stack, Link,Head } from '@chakra-ui/react';
import Header from '../component/header'
import jwt_decode from 'jwt-decode'


export default function Dashboard() {

    const [backendData, setBackendData] = useState({})

    useEffect(() => {
        // Perform localStorage action
        const token = localStorage.getItem('token')
        if(!token){
            

        }
        else{
            //fetch the data from the backend
            //store the data in the state
            //display the data in the page
            const decoded = jwt_decode(token)
            fetch('/api/dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer '+token

                },
                body: JSON.stringify({
                    Auth: token,
                    username: decoded.username.username
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.status == "success"){
                    setBackendData(data.user)
                    console.log(data)
                }else{
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }
            })


        }

        
      }, [])

    return (
        <>  
            
            <main >
            <Header children={backendData}/>
            <Box>
                <Heading>{backendData.username}</Heading>
                <Text>{backendData.email}</Text>
            </Box>
            </main>
            
        </>
    )

}

