import React,{ useEffect, useState} from 'react'
import { Box, Heading, Text, Button, Flex, Stack, Link,Head,Container,StackDivider,Avatar,IconButton,Image,ButtonGroup} from '@chakra-ui/react';
import jwt_decode from 'jwt-decode'
import {load} from '../src/funcs'
import { Sidebar } from '../motion/Sidebar';
import { ImagePost } from '../component/ImagePost';
import {AddIcon} from '@chakra-ui/icons'
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
    Input,
    Spinner,
    Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast
  } from '@chakra-ui/react'

import { create } from 'ipfs-http-client'
import Balance from '../component/balance';


const projectId = '2JGZbAnQ6xq7zTsSpqIUZCam8JA'
const projectSecret = 'f192e2b24a961bba359fe5eb9af466c6'
const ipfsAuth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https', headers: {
        authorization: ipfsAuth
    } 
})





export default function Home() {

    const [backendData, setBackendData] = useState({})
    const [auth, setAuth] = useState(false)
    const [addressAccount, setAddressAccount] = useState('')
    const [didContractDeployed, setDidContractDeployed] = useState('')
    const [certificates, setCertificates] = useState()
    const [posts, setPosts] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [balance, setBalance] = useState(0)
    const [uploadedImage, setUploadedImage] = useState('')
    const [contentInput, setContentInput] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const toast = useToast()


  
  const isImageError = uploadedImage == ''
    const isContentError = contentInput === ''

    const styles = {
        post:{
            width: '43vw',
            height: '95vh',
            borderRadius : '20px',
            overflow: 'scroll',
            position: 'relative',
            transition: 'all 1.5s ',

            
        },
        postBg:{
            width: 'auto',
            height: 'auto',
            borderRadius : '20px',
        },
        account:{
            width: '32vw',
            height: '95vh',
            position: 'relative',
            borderRadius : '20px',
            overflow: 'scroll',
            transition: 'all 1.5s ',
            left: '30px',
            buttom: '100px'


        },
        emptySpace:{
            height: '200px',

        },
        createPost:{
            //stick on the top of the post
            position: 'absolute',
            top: '90%',
            left: '52%',
            zIndex: '3',
            transition: 'all 1.5s ',
        }
    }

    useEffect(() => {
        if(!isOpen){
            setUploadedImage('');
            setContentInput('');
            
        }
    }, [isOpen])

    


    useEffect(() => {
        // Perform localStorage action
        const token = localStorage.getItem('token')
        if(!token){
            setAuth(false)
            //redirect to login page
            window.location.href = '/login'
        }
        else{
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
            .then(async (data) => {
                if(data.status == "success"){
                        setAuth(true)
                        setBackendData(data.user)
                        console.log(data.user.walletPrivateKey)
                        load(data.user.walletPrivateKey).then((data) => {

                        console.log("Account: ",data.addressAccount);
                        console.log("Contract: ",data.didContractDeployed);
                        console.log("profile: ",data.profile);
                        console.log("certificates: ",data.certificates);
                        window.web3.eth.getBalance(data.addressAccount).then((bal) => {
                            const balanceNew = window.web3.utils.fromWei(bal, 'ether') 
                            setBalance(balanceNew)
                            //add balance to local storage
                            localStorage.setItem('balance', balanceNew)
                            localStorage.setItem('addressAccount', data.addressAccount)

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
                        console.log("Posts: ",data.posts)
                        let posts = [];
                        if(data.posts.length > 0){
                            for(let i = 0; i < data.posts.length; i++){
                                if(data.posts[i]['hash'] != ""){
                                    // console.log(data.posts[i]['author'])
                                    posts.push(data.posts[i])

                            
                                }
                            }
                        }
                        //wait for 1 second
                        console.log("Posts: ",posts)
                        setPosts(posts)
                        setAddressAccount(data.addressAccount)
                        setDidContractDeployed(data.didContractDeployed)
                        //remove the last element of the array
                        setCertificates(certificate)
                        })
                }else{
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }
            })
        }
      }, [])

      useEffect(() => {
        if(isMenuOpen){
            //get the element with id post
            const post = document.getElementById('post')
            const account = document.getElementById('account')
            //remove the left property
            // post.style.left = '-43%';
            post.style.left = '10%';
            account.style.left = '15%'; 
            const createpost = document.getElementById('createpost')
            createpost.style.left = '56%'        
        }else{
            const post = document.getElementById('post')
            post.style.left = '5%'
            const account = document.getElementById('account')
            account.style.left = '10%'
            const createpost = document.getElementById('createpost')
            createpost.style.left = '52%'
        }

      }, [isMenuOpen])

      const pullData = (isOpen) => {
        console.log(isOpen)
        setIsMenuOpen(isOpen)
        }

        const captureFile = (event) => {
            event.preventDefault()
            const file = event.target.files[0]
            if (file) {
                const output = document.getElementById('output')
                output.src = URL.createObjectURL(file)
            }
            const reader = new window.FileReader()
            reader.readAsArrayBuffer(file)
        
            reader.onloadend = () => {
              setUploadedImage({ buffer: Buffer(reader.result) })
            }
        }

        const handleContentInputChange = (e) => setContentInput(e.target.value)

        useEffect(() =>{
            console.log(uploadedImage)
        },[uploadedImage])


        //when post button is clicked Upload the image to IPFS and then store the hash to the blockchain with description
        const onSubmit = async (e) => {
            e.preventDefault()
            const postBtn = document.getElementById('postBtn')
            const close = document.getElementById('close')
            postBtn.disabled = true
            close.disabled = true
            setIsUploading(true)
            if(uploadedImage == '' && contentInput == ''){
                alert('Please upload an image and add a description')
            }
            else if(balance == 0){
                alert('Please top up your wallet, required 0.1 ETH to post')         
            }
            else{
                console.log('Submitting the form')
                console.log(uploadedImage.buffer)
                //upload the image to IPFS
                const result = await ipfs.add(uploadedImage.buffer,{pin: true})
                console.log('IPFS result', result)
                const hash = result.path
                console.log(hash)
                
                didContractDeployed.uploadImage(hash, contentInput,{from: addressAccount}).then((r) => {
                    console.log(r)
                    console.log('Image uploaded to blockchain')
                    setUploadedImage('')
                    setContentInput('')
                    onClose()
                    toast({
                        title: 'Post created.',
                        description: "We've created your post for you.",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                      })
                    //reload the page
                    window.location.reload()

                })
                .catch((err) => {
                    console.log(err)
                    toast({
                        title: 'An error occurred.',
                        description: "We couldn't create your post.", 
                        status: 'error',
                        duration: 9000,
                        isClosable: true
                    })
                })

                
            }
            setIsUploading(false)
            postBtn.disabled = false
            close.disabled = false
        }

        



    return (
        <>  
            
            <Sidebar setSidebar={pullData} balance={balance} account={addressAccount} />
                <Modal closeOnOverlayClick={false}  isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Add Post</ModalHeader>
                    <ModalCloseButton id='close'/>
                    <ModalBody>
                    <FormControl isInvalid={isImageError} className='mb-4'>
                        
                                        <FormLabel>Upload Image</FormLabel>
                                        <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={captureFile} />
                                        {!isImageError ? (
                                                <FormHelperText>
                                                Uploaded an image
                                                </FormHelperText>          

                                        ) : (
                                            <FormErrorMessage>Uploading Image is required</FormErrorMessage>
                                        )}
                                        <img id="output"/>
                                    </FormControl>

                                    <FormControl isInvalid={isContentError} className='mb-4'>
                                        <FormLabel>Post caption</FormLabel>
                                        <Input type='text' value={contentInput} onChange={handleContentInputChange} />
                                        {!isContentError ? (
                                            <FormHelperText>
                                            Entered caption
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>Post caption is required.</FormErrorMessage>
                                        )}
                                    </FormControl>
                                    {
                                        isUploading ? (
                                            <Alert status='warning'>
                                                <AlertIcon/>
                                                Don't close the window while uploading          
                                            </Alert>
                                        ) : (
                                            <></>
                                        )
                                    }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onSubmit} id='postBtn'>
                        {
                            isUploading ? (
                                <Spinner size='sm' />
                            ) : (
                                'Post'
                            )
                        }
                        </Button>
                        
                    </ModalFooter>
                    </ModalContent>
            </Modal>
            <div className='row'>
                <ButtonGroup size='md' isAttached variant='outline' style={styles.createPost} id="createpost">
                    <IconButton  onClick={onOpen} icon={<AddIcon />} bg={'green.300'}/>
                </ButtonGroup>
                
                <div className="post bg-dark col-8" style={styles.post} id="post">
                    
                    <div className="col" >
                        
                        <Flex direction="column" align="center"  h="100%" gap='4' >
                           <div className='mt-4' ></div> 
                            {

                                 posts && posts.map((post) => {
                                    return (
                                        
                                        <div className = "bg-white postBg" style={styles.postBg}  align="center" >
                                            <>
                                            <ImagePost post={post} contract={didContractDeployed} addressAccount={addressAccount} />
                                            </>
                                        </div>
                                        
                                    )
                                })
                            }
                        </Flex>
                     
                    </div>



                </div>

                <div className="account bg-dark col-4" style={styles.account} id='account'>
                    
                    {/* <div className="col" >
                        <Flex direction="column" align="center"  h="100%" gap='4' >

                            <div className = "bg-white ">
                                
                            </div>


                            <div className = "bg-white postBg" style={styles.postBg}  align="center" >
                                <ImagePost />
                            </div>

                            <div className = "bg-white postBg" style={styles.postBg}  align="center" >
                                <ImagePost />
                            </div>
                        </Flex>
                    </div> */}



                </div>


            </div>
            

            




            
            

            
        </>
    )

}

