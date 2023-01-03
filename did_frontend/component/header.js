import {Flex,Box, Text,Image, Stack, Link,useDisclosure,Button,Input,Divider} from "@chakra-ui/react"
import React,{ use, useEffect, useState} from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import {load} from '../src/funcs'


export default function Header({status,children}){
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [pressLogout, setPressLogout] = useState(false)
  const btnRef = React.useRef()


  useEffect(() => { 
    // console.log(status)
    // console.log(children)

    if(pressLogout){    
        console.log('logout ing')
        //fetch the data from the backend
        //store the data in the state
        //display the data in the page
        fetch('/api/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer '+localStorage.getItem('token')
            },
            body: JSON.stringify({
                username: children.username
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.status == "success"){
                localStorage.removeItem('token')
                console.log(data)
                setPressLogout(false)
                window.location.href = '/login'
            }else{
                console.log(data)
            }
        })

        
    }
    }, [pressLogout])



  return (
    <>
    <Flex
      as="nav"
      align="center"
      wrap="wrap"
      w="100%"
      mb={8}
      px={6}    
      py={4}
      bg='gray.600'
    >
        <Box pr={10}>
            <Button ref={btnRef} color='whiteAlpha.100' onClick={onOpen} size='md'>
            <Image src='/assets/menu.png' boxSize='30px'/>
            </Button>
        </Box>
        <Box pr={10} align="center">
            
            <Link href='/'>
                <Image src='/assets/metaverse.png' boxSize='50px'/>
                <Text display="block" fontSize="lg" fontWeight="bold" color='white'>
                    IDENTITY
                </Text>
            </Link>
            
            
        </Box>
        <Stack
            direction="row"
        >
        
        
        <Text display="block" fontSize="lg" fontWeight="bold" color='white'>
            Welcome back,  
            {
                children ? children.username : ''
            }
        </Text>
        
        </Stack>
    </Flex>
    <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
    >
        <DrawerOverlay />
        <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
                
                <Link href='/dashboard/profile' py={4}>
                    Profile
                </Link>
                <Divider orientation='horizontal' my={2} />
                <Link href='https://chakra-ui.com' py={4}>
                    
                </Link>
                <Divider orientation='horizontal' my={2}/>
            
            </DrawerBody>


            <DrawerFooter>
                {/* <Button variant='outline' mr={3} onClick={onClose}>
                Close
                </Button> */}
                {
                        !status ?
                        <Button onClick={()=> window.location.href = '/login'} colorScheme='blue'>
                            Login
                        </Button>
                        :
                        <Button onClick={()=>setPressLogout(true)} colorScheme='red'>
                            Logout
                        </Button>
                        
                        
                    } 
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
    </>
  )
}