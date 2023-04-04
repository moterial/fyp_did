import { useRouter } from 'next/router'

import React,{ useEffect, useState} from 'react'
import { Box, Heading, Text, Button, Flex, Stack, Link,Head,Container,StackDivider,Spinner,Input} from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter,Tooltip,Badge } from '@chakra-ui/react'
import jwt_decode from 'jwt-decode'
import {loadUserProfile} from '../../../src/funcs2'
import { Sidebar } from '../../../motion/Sidebar';
import Carousel from 'react-bootstrap/Carousel';
import { CheckCircleIcon,CloseIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'

const Post = () => {
    const router = useRouter()
    const { address } = router.query




const styles = {
    profile:{
        width: '65vw',
        height: '95vh',
        borderRadius : '20px',
        overflow: 'scroll',
    },
    bgContainer:{
        //make it the center of the page
        position:'relative',
        left:'50%',
        transform:'translateX(-50%)',
        width: '60vw',
        height: 'auto',
        borderRadius : '20px',
    },
    infoCard:{
        position:'relative',
        left:'50%',
        transform:'translateX(-50%)',
        width: '60vw',
        borderRadius : '20px',
        background: 'linear-gradient(to right, #42275a, #734b6d)',
        color: 'white',
    },
    certiCard:{
        position:'relative',
        left:'50%',
        transform:'translateX(-50%)',
        width: '50vw',
        borderRadius : '20px',
        background: 'linear-gradient(to right, #42275a, #734b6d)',
        color: 'white',
    },
    addCertiBtn:{
        position:'relative',
        left:'55%',
        transform:'translateX(-50%)',
        borderRadius : '20px',
        background: 'linear-gradient(to right, #42275a, #734b6d)',
        color: 'white'

    },
    editProfile:{
        position:'relative',
        background: 'linear-gradient(to left, #42275a, #9C5091)',
        color: 'white'


    }
  
}


    const [backendData, setBackendData] = useState({})
    const [auth, setAuth] = useState(false)
    const [addressAccount, setAddressAccount] = useState('')
    const [didContractDeployed, setDidContractDeployed] = useState('')
    const [certificates, setCertificates] = useState()
    const [profile, setProfile] = useState()
    const [loading, setLoading] = useState(true)
    const [isEditLoading, setIsEditLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { 
        isOpen: isOpenEditModal, 
        onOpen: onOpenEditModal, 
        onClose: onCloseEditModal 
    } = useDisclosure()
    const [balance, setBalance] = useState(0)
    const [nameInput, setNameInput] = useState('')
    const [contentInput, setContentInput] = useState('')
    const [dateInput, setDateInput] = useState('')
    const [approverInput, setAppproverInput] = useState('')
    const [regName, setRegName] = useState('')
    const [regEmail, setRegEmail] = useState('')
    const [regPhone, setRegPhone] = useState('')
    const [regBios, setRegBios] = useState('')

    const handleRegNameChange = (e) => {
        setRegName(e.target.value)
      }
      const handleRegEmailChange = (e) => {
        setRegEmail(e.target.value)
      }
    
      const handleRegPhoneChange = (e) => {
        setRegPhone(e.target.value)
      }
    
      const handleRegBiosChange = (e) => {
        setRegBios(e.target.value)
      }

  const handleNameInputChange = (e) => setNameInput(e.target.value)
  const handleContentInputChange = (e) => setContentInput(e.target.value)
  const handleDateInputChange = (e) => setDateInput(e.target.value)
    const handleApproverInputChange = (e) => setAppproverInput(e.target.value)

    const isNameError = nameInput === ''
    const isContentError = contentInput === ''
    const isDateError = dateInput === ''
    const isApproverError = approverInput === ''


    useEffect(() => {
        if(!isOpen){
            handleAddCerti()
            handleModalClose()
        }
    }, [isOpen])

    useEffect(() => {
        if(!isOpenEditModal){
           setRegName('')
              setRegEmail('')
                setRegPhone('')
                    setRegBios('')
        }
    }, [isOpenEditModal])


    function handleModalClose(){
        setNameInput('')
        setContentInput('')
        setDateInput('')
    }

    const handleEdit = async () => {
        if(regName === '' || regEmail === '' || regPhone === '' || regBios === ''){
            return alert("Please fill in all the fields")
        }
        if(!regEmail.includes('@')){
            alert('Please enter a valid email')
            return
        }
        //check phone number format
        if(regPhone.length != 8){
            alert('Please enter a valid phone number')
            return
        }
        setIsEditLoading(true)
        const editClose = document.getElementById('editClose')
        const editSave = document.getElementById('editSave')
        const editTopClose = document.getElementById('editTopClose')
        editClose.disabled = true
        editSave.disabled = true
        editTopClose.style.display = 'none'
        didContractDeployed.store(regName,regEmail,regBios, {from: addressAccount})
        .then((res) => {
            console.log(res)
            alert("Profile edited successfully")
            const token = localStorage.getItem('token')
            const decode = jwt_decode(token)
            fetch('/api/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    username: decode.username.username,
                    name: regName,
                    email: regEmail,
                    phone: regPhone,
                    bio: regBios
                })
            
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                alert(data.message)
            })
            .catch((err) => {
                console.log(err)
                alert(data.message)
            })


            setIsEditLoading(false)
            editTopClose.style.display = 'show'
            editClose.disabled = false
        editSave.disabled = false
            window.location.reload()
        })
        .catch((err) => {
            console.log(err)
            alert("Error editing profile")
        })
        
    }

    const handleAddCerti = async () => {
        //check if the input is empty
        if(isNameError || isContentError || isDateError){
            return 
        }
        else if(balance < 0.005){
            return alert("You don't have enough balance to add a certificate, please fund your account(required balance: 0.005 ETH)")
        }
        else{
            //add the certificate to the blockchain
            await didContractDeployed.addCertificate(nameInput,contentInput,dateInput,approverInput, {from: addressAccount})
            .then((res) => {
                console.log(res)
                alert("Certificate added successfully")
                //reload the page
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
                alert("Error adding certificate")
            })
        }
    }


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
                    username: decoded.username.username,
                    name: regName,
                    email: regEmail,
                    phone: regPhone,
                    bios: regBios


                })
            })
            .then((res) => res.json())
            .then(async (data) => {
                if(data.status == "success" && address){
                        
                        setAuth(true)
                        setBackendData(data.user)
                        console.log(data.user.walletPrivateKey)
                        console.log(address)
                        const user = data.user
                        loadUserProfile(data.user.walletPrivateKey,address ).then((data) => {

                        console.log("Account: ",address);
                        console.log("Contract: ",data.didContractDeployed);
                        console.log("Profile: ",data.profile);
                        console.log("Certificates: ",data.certificates);
                        window.web3.eth.getBalance(user.walletAddress).then((bal) => {
                            const balanceNew = window.web3.utils.fromWei(bal, 'ether') 
                            setBalance(balanceNew)
                            //add balance to local storage
                            localStorage.setItem('balance', balanceNew)
                            localStorage.setItem('addressAccount', user.walletAddress)

                            console.log(balance)
                        })
                        let certificate = [];
                        //loop through the certificates if it is not empty and push it to the array
                        if(data.certificates.length > 0){
                            for(let i = 0; i < data.certificates.length; i++){
                                if(data.certificates[i]['name'] != ""){
                                    certificate.push(data.certificates[i])
                                }
                            }
                        }
                        console.log("Certificates: ",certificate)
                        setProfile(data.profile)
                        setAddressAccount(user.walletAddress)
                        setDidContractDeployed(data.didContractDeployed)
                        //remove the last element of the array
                        setCertificates(certificate)
                        })

                    
                }
                
            })


        }
        //wait for 2 seconds
        setTimeout(() => {
            setLoading(false)
        }, 200);
        
        

        
      }, [address])
      const pullData = (isOpen) => {
        console.log(isOpen)


        }

    return (
        <>  
            <Sidebar setSidebar={pullData} balance={balance} account={addressAccount} />
            {
                loading ?
                <div className='d-flex justify-content-center align-items-center' style={{height:'130vh'}}>
                    <Spinner color='white' size='xl' thickness='4px' speed='0.65s'  />
                </div>
                :
                null
            }
            { auth ?
                
                <div className=' bg-dark profile' style={styles.profile} >
                    
                        <img src='/assets/bg3.png' alt='bg' className='bgContainer pt-3' style={styles.bgContainer} />
                        <img src='https://cdn-icons-png.flaticon.com/512/1177/1177568.png' alt='profile' className='profileImg' style={{position:'relative',left:'50%',transform:'translateX(-50%)',width:'150px',height:'150px',borderRadius:'50%',bottom:'75px'}} />
                        <h1 className='text-center fw-bold' style={{color:'white',position:'relative',bottom:'65px',fontSize:'30px'}}>{
                            profile &&
                            profile['0']
                        }</h1>
                        <Card className='infoCard mb-4' style={styles.infoCard}>
                            <CardHeader>
                                <Heading size='md'>User Profile </Heading>
                                {
                                  backendData.walletAddress == address &&
                                    <Button className='editProfile float-end' style={styles.editProfile} onClick={onOpenEditModal}>Edit</Button>
                                      
                                }
                                
                            </CardHeader>

                            <CardBody>
                                <Stack divider={<StackDivider />} spacing='4'>
                                    {
                                        profile &&
                                        <>
                                        <Stack divider={<StackDivider />} spacing='4'>
                                        <Box>
                                            <Heading size='md' textTransform='uppercase'>
                                            Name
                                            </Heading>
                                            <Text pt='2' fontSize='md'>
                                            {profile['0']}
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Heading size='md' textTransform='uppercase'>   
                                            Email
                                            </Heading>
                                            <Text pt='2' fontSize='md'>
                                            {profile['1']}
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Heading size='md' textTransform='uppercase'>   
                                            Bios
                                            </Heading>
                                            <Text pt='2' fontSize='md'>
                                            {profile['2']}
                                            </Text>
                                        </Box>
                                        </Stack>
                                        </>
                                    }
                                
                                </Stack>
                            </CardBody>
                        </Card>

                            


                            <Carousel className='mb-3'>
                                {
                                    certificates &&
                                    certificates.map((certificate,index) => {
                                        return(
                                            <Carousel.Item>
                                               
                                                <Card className='certiCard mb-4' style={styles.certiCard}>
                                                    <CardHeader>
                                                        <Heading size='md'>Certificate</Heading>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Stack divider={<StackDivider />} spacing='4'>
                                                            <Stack divider={<StackDivider />} spacing='4'>
                                                            <Box>
                                                                <Heading size='xs' textTransform='uppercase'>
                                                                Name
                                                                </Heading>
                                                                <Text pt='2' fontSize='sm'>
                                                                {certificate.name}
                                                                </Text>
                                                            </Box>
                                                            <Box>
                                                                <Heading size='xs' textTransform='uppercase'>
                                                                content
                                                                </Heading>
                                                                <Text pt='2' fontSize='sm'>
                                                                {certificate.content}
                                                                </Text>
                                                            </Box>
                                                            <Box>
                                                                <Heading size='xs' textTransform='uppercase'>
                                                                issueDate
                                                                </Heading>
                                                                <Text pt='2' fontSize='sm'>
                                                                {certificate.issueDate}
                                                                </Text>
                                                            </Box>
                                                            <Box>
                                                                <Heading size='xs' textTransform='uppercase'>
                                                                
                                                                isApproved?  {
                                                                    certificate.isApproved.toString() === 'true' ?
                                                                    <Tooltip label={certificate.approvedBy} aria-label='Approved'>
                                                                        <CheckCircleIcon color='green' />
                                                                    </Tooltip>
                                                                    :
                                                                    <>
                                                                    <Tooltip label='Not Approved' aria-label='Not Approved'>
                                                                        <CloseIcon color='red' />
                                                                    </Tooltip>
                                                                    {
                                                                        backendData.walletAddress == certificate.requiredApprover &&
                                                                        <Input type='checkbox' name='isApproved' value={index} onChange={handleCheckboxChange} />
                                                                    }
                                                                    
                                                                    </>
                                                                }
                                                                
                                                                </Heading>
                                                                <Text pt='2' fontSize='sm'>
                                                                {
                                                                    certificate.isApproved.toString() === 'true' ?
                                                                    
                                                                    <Badge colorScheme='green'>Approved</Badge>
                                                                    
                                                                    :
                                                                    
                                                                    <Badge colorScheme='red'>
                                                                       
                                                                        Not Approved
                                                                        
                                                                    </Badge>
                                                            
                                                                    
                                                                    
                                                                    
                                                                }
                                                                </Text>
                                                            </Box>
                                                            <Box>
                                                                <Heading size='xs' textTransform='uppercase'>
                                                                Required Approver
                                                                </Heading>
                                                                <Text pt='2' fontSize='sm'>
                                                                {certificate.requiredApprover}
                                                                </Text>
                                                            </Box>
                                                            
                                                            </Stack>
                                                        </Stack>
                                                    </CardBody>
                                                </Card>
                                            </Carousel.Item>
                                        )
                                    })
                                }

                            </Carousel>

                            
                            {
                              backendData.walletAddress == address &&
                              <Button className='addCertiBtn mb-4 addCertiBtnHover' style={styles.addCertiBtn} onClick={onOpen}>Add Certificate</Button>
                            }
                            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                <ModalHeader>Add Certificate</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <FormControl isInvalid={isNameError} className='mb-4'>
                                        <FormLabel>Certificate Name</FormLabel>
                                        <Input type='email' value={nameInput} onChange={handleNameInputChange} />
                                        {!isNameError ? (
                                            <FormHelperText>
                                            Enter the name of the Certificate.
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>Certificate Name is required.</FormErrorMessage>
                                        )}
                                    </FormControl>

                                    <FormControl isInvalid={isContentError} className='mb-4'>
                                        <FormLabel>Certificate Content</FormLabel>
                                        <Input type='text' value={contentInput} onChange={handleContentInputChange} />
                                        {!isContentError ? (
                                            <FormHelperText>
                                            Enter the content to describe this Certificate 
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>Certificate Content is required.</FormErrorMessage>
                                        )}
                                    </FormControl>

                                    <FormControl isInvalid={isDateError} className='mb-4'>
                                        <FormLabel>Certificate Issue Date</FormLabel>
                                        <Input type='date' value={dateInput} onChange={handleDateInputChange} />
                                        {!isDateError ? (
                                            <FormHelperText>
                                            Enter the issue date of this Certificate
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>Certificate Issue Date is required.</FormErrorMessage>
                                        )}
                                    </FormControl>

                                    <FormControl isInvalid={isDateError} className='mb-4'>
                                        <FormLabel>Required Approver</FormLabel>
                                        <Input type='text' value={approverInput} onChange={handleApproverInputChange} />
                                        {!isApproverError ? (
                                            <FormHelperText>
                                            Enter the Required Approver of this Certificate
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>Required Approver is required.</FormErrorMessage>
                                        )}
                                    </FormControl>
                                    

                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                                    Submit
                                    </Button>
                                    {/* <Button variant='ghost' colorScheme='green' onClick={handleAddCerti()}>Submit</Button> */}
                                </ModalFooter>
                                </ModalContent>
                            </Modal>

                            <Modal closeOnOverlayClick={false} isOpen={isOpenEditModal} onClose={onCloseEditModal}>
                                <ModalOverlay />
                                <ModalContent>
                                <ModalHeader>Edit Profile</ModalHeader>
                                <ModalCloseButton id='editTopClose'/>
                                <ModalBody>
                                <Stack spacing={4}>
                                    <FormControl id="Username">
                                    <FormLabel>Your Name</FormLabel>
                                    <Input type="text" value={regName} onChange={handleRegNameChange} />
                                    </FormControl>
                                    <FormControl id="email">
                                    <FormLabel>Email</FormLabel>
                                    <Input type="text" value={regEmail} onChange={handleRegEmailChange} />
                                    </FormControl>
                                    <FormControl id="Phone">
                                    <FormLabel>Phone</FormLabel>
                                    <Input type="number" value={regPhone} onChange={handleRegPhoneChange} />
                                    </FormControl>
                                    <FormControl id="Phone">
                                    <FormLabel>Profile Bios </FormLabel>
                                    <textarea type="textarea" value={regBios} onChange={handleRegBiosChange} rows="4" cols="50" className="border rounded p-1" />
                                    </FormControl>
                                </Stack>
                                    
                                    

                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onCloseEditModal} id='editClose'>
                                    {
                                        isEditLoading ?
                                        <Spinner size='sm' />
                                        :
                                        'Close'
                                    }
                                    </Button>
                                    <Button onClick={handleEdit} colorScheme='green' id='editSave'>
                                    {
                                        isEditLoading ?
                                        <Spinner size='sm' />
                                        :
                                        'Save'
                                    }
                                    </Button>
                                </ModalFooter>
                                </ModalContent>
                            </Modal>

                        

                </div>
                :
                <Container >
                    <Heading align='center'>Not logged in</Heading>
                </Container>
                
            }

            

        </>
    )




  

 
}

export default Post