import Head from 'next/head'
import { Card, CardHeader, CardBody, CardFooter,Stack,VStack,Heading,Text,Divider,ButtonGroup,Button,Image,Center,Flex,useColorModeValue,Link,Box,FormControl,FormLabel,Input,Checkbox} from '@chakra-ui/react'
import React,{ useEffect, useState, useRef} from 'react'
import jwt_decode from 'jwt-decode'
import { Sidebar } from '../motion/Sidebar';
import {load} from '../src/funcs'
import contract from '@truffle/contract';
import * as faceapi from '../src/face-api.js';


const Web3EthAccounts = require('web3-eth-accounts');

export default function Login() {
  const [backendData, setBackendData] = useState({})
  const [accountLogin, setAccountLogin] = useState(false)
  const [auth, setAuth] = useState(false)
  const [faceLogin, setfaceLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [register, setRegister] = useState(false)

  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regBios, setRegBios] = useState('')
  const [regName, setRegName] = useState('')
  const videoRef = useRef();
  const canvasRef = useRef();
  const [faceDetected,setFaceDetected] = useState(false);
  const [videoSrc,setVideoSrc] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token){
      const decoded = jwt_decode(token)
      console.log(decoded.username.username)
      fetch('/api/dashboard/', {
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
          setAuth(true)
          window.location.href = '/'
        }else{
          localStorage.removeItem('token')
        }
      })
    }
    
  }, [])


  useEffect(() => {
    if(faceLogin){
      const loadModel = async () => {
        const MODEL_URI = '../models';
        Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URI),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URI),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URI),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URI),
          // faceapi.loadFaceRecognitionModel(MODEL_URI),
          // faceapi.loadFaceRecognitionModel(MODEL_URI)
          
        ]).then( async () => {
            startVideo()
          //   const mtcnnForwardParams = {
          //     maxNumScales: 10,
          //     // scale factor used to calculate the scale steps of the image
          //     // pyramid used in stage 1
          //     scaleFactor: 0.709,
          //     // the score threshold values used to filter the bounding
          //     // boxes of stage 1, 2 and 3
          //     scoreThresholds: [0.6, 0.7, 0.7],
          //     // limiting the search space to larger faces for webcam detection
          //     minFaceSize: 200
          //   }
            
          //   const mtcnnResults = await faceapi.mtcnn(videoRef.current, mtcnnForwardParams)
          //   faceapi.drawDetection(canvasRef.current, mtcnnResults.map(res => res.faceDetection), { withScore: false })
          // faceapi.drawLandmarks(canvasRef.current, mtcnnResults.map(res => res.faceLandmarks), { lineWidth: 4, color: 'red' })



        })
      }
      loadModel()
      

    }
  }, [faceLogin])

  const startVideo = async() => {
    navigator.getUserMedia(
      { video: {} },
      stream => videoRef.current.srcObject = stream,
      err => console.error(err)
    )

    
  }

  const handleVideoOnPlay = () => {
    setInterval(async() => {
      
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current)
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height }
      faceapi.matchDimensions(canvasRef.current, displaySize)

      const detection = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detection, displaySize)
      canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections)
      //get the updated faceDetected state 
      console.log(detection)


     

    }, 1000)

    
  }



  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handleRegNameChange = (e) => {
    setRegName(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleRegUsernameChange = (e) => {
    setRegUsername(e.target.value)
  }

  const handleRegPasswordChange = (e) => {
    setRegPassword(e.target.value)
  }

  const handleRegConfirmPasswordChange = (e) => {
    setRegConfirmPassword(e.target.value)
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

  function handleAccountLogin(){
    //get the username and password from the input
    //send the username and password to the backend
    //if the username and password is correct, the backend will send back a token
    //store the token in the local storage
    //redirect to the dashboard page
    const data = {
      username: username,
      password: password
    }
    fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      if(data.token){
        localStorage.setItem('token', data.token)
        window.location.href = '/'
      }
    })
  }

  const pullData = (isOpen) => {
    console.log(isOpen)

    }

    function handleAccountRegister(){

      //create a new user in the blockchain
      //create a new user in the database
      //send the username and password to the backend
      //if the username and password is correct, the backend will send back a token
      //store the token in the local storage
      //redirect to the dashboard page
      if(regUsername == '' || regPassword == '' || regConfirmPassword == '' || regEmail == '' || regPhone == ''){
        alert('Please fill in all the fields')
        return
      }
      //check email format
      if(!regEmail.includes('@')){
        alert('Please enter a valid email')
        return
      }
      //check phone number format
      if(regPhone.length != 8){
        alert('Please enter a valid phone number')
        return
      }
      if(regPassword != regConfirmPassword){
        alert('Password does not match')
        return
      }
      if(confirm('Are you sure you want to register?') == false){
        return
      }

      fetch('/api/user/checkUsername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: regUsername
        })
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.status == 'success'){
          console.log('username available')
        }else{
          alert('Username already exists')
          return
        }
      })
      
      console.log('registering')
      const account = new Web3EthAccounts('HTTP://127.0.0.1:7545');
      const result = account.create()
      console.log(result)
      let key = result.privateKey.substring(2)
      let accountAddress = result.address
      let addAccount = account.wallet.add(key)
      console.log(addAccount)
      const data1 = {
        username: regUsername,
        password: regPassword,
        name:regUsername,
        email: regEmail,
        phone: regPhone,
        walletAddress: accountAddress,
        bios: regBios,
        walletPrivateKey: key
      }
      fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data1)
      })
      .then((res) => res.json()) 
      .then((data) => {
        console.log(data)
        if(data.token){
          localStorage.setItem('token', data.token)
        }
      })
      .catch((err) => {
        console.log(err)
        alert('Error')
      })
      setTimeout(2000)
      load(key).then((data) => {
          console.log(data.didContractDeployed)
          data.didContractDeployed.store(regName,regEmail,regBios,{from:accountAddress}).then((data) => {
            console.log(data)
            alert('Registration successful')
            window.location.href = '/'
          })


      })
        
    }
  



  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Header status={auth} children={null} /> */}
      <Sidebar setSidebar={pullData}/>
      {
        !auth &&
      <main >
        <div >
          {
            (!accountLogin && !faceLogin && !register)  &&
            <Card maxW='lg' className='container bg-white' >
              <CardBody>
                <Center>
                  <Image
                    src='/assets/face-id.png'
                    boxSize='200px'
                  />
                </Center>
                <Stack mt='6' spacing='3'>
                  <Center>
                    <Button colorScheme='teal' size='lg' onClick={() => setfaceLogin(true)}  className='container' >
                      FaceID Login
                    </Button>
                  </Center>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing='2' >
                  <Button className='container px-5' onClick={() => setAccountLogin(true)} variant='solid' colorScheme='blue' >
                    Login by username and pw
                  </Button>
                  <Button className='container' variant='ghost' colorScheme='blue' onClick={() => setRegister(true)}>
                    register
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          }
          {
            accountLogin  && 
            <Flex
              minH={'75vh'}
              justify={'center'}
              minW={'40vw'}
              bg={useColorModeValue('gray.50', 'inherit')}
              //make border radius smaller
              borderRadius={'xl'}
            >
              <Stack spacing={8}  maxW={'lg'} py={5} px={6} mt={10}  >
                <Stack align={'center'}>
                  <Heading fontSize={'4xl'} style={{color:'#FF008C'}} className="mb-3" >Sign in to your account</Heading>
                  <Text fontSize={'lg'} color={'gray.600'} className="fw-bold">
                    to enjoy all of our cool <Link color={'#4400FF'}>features</Link> ✌️
                  </Text>
                </Stack>
                <Box
                  rounded={'lg'}
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  p={8}>
                  <Stack spacing={4}>
                    <FormControl id="email">
                      <FormLabel>Username</FormLabel>
                      <Input type="text" value={username} onChange={handleUsernameChange} />
                    </FormControl>
                    <FormControl id="password">
                      <FormLabel>Password</FormLabel>
                      <Input type="password" value={password} onChange={handlePasswordChange} />
                    </FormControl>
                    <Stack spacing={10}>
                      <Stack
                        direction={{ base: 'column', sm: 'row' }}
                        align={'start'}
                        justify={'space-between'}>
                        <Link color={'blue.400'}>Forgot password?</Link>
                      </Stack>
                      <Button
                      onClick={() => handleAccountLogin()}
                        bg={'white'}
                        color={'red.400'}
                        _hover={{
                          bg: 'teal.200',
                        }}
                        className="border-2 border-danger"
                        
                        >
                          
                        Sign in
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Flex>

          }
          {
            register  && 
            <Flex
              minH={'75vh'}
              justify={'center'}
              minW={'40vw'}
              bg={useColorModeValue('gray.50', 'inherit')}
              //make border radius smaller
              borderRadius={'xl'}
              className="mb-4 border rounded-lg"
            >
              <Stack spacing={8}  maxW={'lg'} py={5} px={6} mt={10}  >
                <Stack align={'center'}>
                  <Heading fontSize={'4xl'} style={{color:'#FF008C'}} className="mb-3" >Register your account</Heading>
                  <Text fontSize={'lg'} color={'gray.600'} className="fw-bold">
                    to join our big <Link color={'#4400FF'}>family</Link> ✌️
                  </Text>
                </Stack>
                <Box
                  rounded={'lg'}
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  p={8}>
                  <Stack spacing={4}>
                    <FormControl id="Username">
                      <FormLabel>Username</FormLabel>
                      <Input type="text" value={regUsername} onChange={handleRegUsernameChange} />
                    </FormControl>
                    <FormControl id="Name">
                      <FormLabel>Name</FormLabel>
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
                      <textarea type="textarea" value={regBios} onChange={handleRegBiosChange} rows="3" cols="50" className="border rounded p-1" />
                    </FormControl>
                    <FormControl id="Regpassword">
                      <FormLabel>Password</FormLabel>
                      <Input type="password" value={regPassword} onChange={handleRegPasswordChange} id='Regpassword'/>
                    </FormControl>
                    <FormControl id="password">
                      <FormLabel>Confirm your Password</FormLabel>
                      <Input type="password" value={regConfirmPassword} onChange={handleRegConfirmPasswordChange} />
                    </FormControl>
                    <Stack spacing={10}>
                      
                      <Button
                      onClick={() => handleAccountRegister()}
                        bg={'white'}
                        color={'red.400'}
                        _hover={{
                          bg: 'teal.200',
                        }}
                        className="border-2 border-danger"
                        
                        >
                          
                        register
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Flex>

          }{
            faceLogin  &&
            <Flex
              minH={'75vh'}
              justify={'center'}
              minW={'40vw'}
              bg={useColorModeValue('gray.50', 'inherit')}
              //make border radius smaller
              borderRadius={'xl'}
            >
              <Stack spacing={8}  maxW={'lg'} py={5} px={6} mt={10}  >
                <Stack align={'center'}>
                  <Heading fontSize={'4xl'} style={{color:'#FF008C'}} className="mb-3" >Sign in to your account</Heading>
                  <Text fontSize={'lg'} color={'gray.600'} className="fw-bold">
                    to enjoy all of our cool <Link color={'#4400FF'}>features</Link> ✌️
                  </Text>
                </Stack>
                <Box
                  rounded={'lg'}
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  p={8}>
                  <Stack spacing={4}>
                    <FormControl id="email">
                      <FormLabel>Username</FormLabel>
                      <Input type="text" value={username} onChange={handleUsernameChange} />
                    </FormControl>


                    <Box id="cam" w='500px' h='320px'>
                      <video ref={videoRef} autoPlay muted id="video" width="400" height="300" className="border rounded-lg" onPlay={handleVideoOnPlay}>  </video>
                      <canvas ref={canvasRef} id="canvas" width="400" height="300" className="border rounded-lg" ></canvas>

                    </Box>
                      
                    
                    
                    <button >Capture</button>
                    <button >Login</button>

                     
                      

                    
                    
                  </Stack>
                  
                </Box>
              </Stack>
            </Flex>
              


          }
          </div>
      </main>
      }
      
    </>

    
  )
}
