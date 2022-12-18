import {Flex,Box, Text,Image, Stack, Link} from "@chakra-ui/react"
import React,{ useEffect, useState} from 'react'


export default function Header(){

   const [changeGuestText,setChangeGuestText] = React.useState('Guest, Please Login')

   useEffect(() => {
    // Perform localStorage action
    const token = localStorage.getItem('token')
    if(token){
        setChangeGuestText('Welcome, User')

    }

  }, [])

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      px={8}    
      py={4}
      bg='teal'
    >
        <Box>
            <Text fontSize="md" fontWeight="bold" color='white'>
                <Image src='/assets/metaverse.png'
                boxSize='70px'/>
                IDENTITY
            </Text>
        </Box>

        <Stack
            spacing={8}
            align="center"
            justify={["center", "space-between", "flex-end", "flex-end"]}
            direction={["column", "row", "row", "row"]}
            pt={[4, 4, 0, 0]}
        >   
        <Text display="block" fontSize="lg" fontWeight="bold" color='white'>
            {changeGuestText}
        </Text>
            <Link >
                <Text display="block" fontSize="lg" fontWeight="bold" color='white'>
                   Profile
                </Text>
            </Link>

            <Link >
                <Text display="block" fontSize="lg" fontWeight="bold" color='white'>
                   Menu2
                </Text>
            </Link>

            <Link >
                <Text display="block" fontSize="lg" fontWeight="bold" color='white'>
                   Logout
                </Text>
            </Link>


        </Stack>
    </Flex>
  )
}