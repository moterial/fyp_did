import Head from 'next/head'
import { Card, CircularProgress, CardHeader, CardBody, CardFooter,Stack,VStack,Heading,Text,Divider,ButtonGroup,Button,Center,Flex,useColorModeValue,Link,Box,FormControl,FormLabel,Input,Checkbox} from '@chakra-ui/react'
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
  const [modelLoaded, setModelLoaded] = useState(false);
  const [faceMatched, setFaceMatched] = useState(false);
  const [faceLoginClicked, setFaceLoginClicked] = useState(null);
  const [registerFace, setRegisterFace] = useState(false);
  const [faceImage, setFaceImage] = useState(null);
  const faceMatcherRef = useRef(null);

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
    if(faceLoginClicked){
      const loadModel = async () => {
        const MODEL_URI = '../models';
        Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URI),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URI),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URI),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URI),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URI)
          
        ]).then(() => {
            setModelLoaded(true);
            startVideo()
        })
      }
      loadModel()
      

    }
  }, [faceLoginClicked])


  useEffect(() => {
    if(registerFace){
      const MODEL_URI = '../models';
    async function loadModels() {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URI),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URI),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URI),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URI),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URI)
        
      ]);
      setModelLoaded(true);
    }
    loadModels();
    startVideo()
    }
  }, [registerFace]);






  const handleFaceLoginClicked = async () => {
    setFaceLoginClicked(true)

    const btn = document.getElementById('faceLoginClicked')
    btn.disabled = true
    if(faceLogin && username != ''){
        const imgBlob = await fetch('/api/user/faceid/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            
            },
            body: JSON.stringify({
              username: username  
            })
          }).then((res) => res.blob());
          
          const img = new Image();
          img.src = URL.createObjectURL(imgBlob);
          
          const label = username;
          
        const loadFaceMatcher = async () => {
          
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          console.log(detections)
          if (detections && detections.descriptor) {
            const descriptors = await new faceapi.LabeledFaceDescriptors(label, [
              detections.descriptor,
            ]);
            faceMatcherRef.current = new faceapi.FaceMatcher(descriptors);
          } else {
            console.error("Face not detected");
          }
         
        };
        loadFaceMatcher();
        setModelLoaded(true);
    }else{
      alert('Please enter your username')
    }
  }

  const onVideoPlay = async () => {
    if (canvasRef.current && videoRef.current.srcObject && modelLoaded ) {
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      if (detection) {
        const bestMatch = faceMatcherRef.current.findBestMatch(detection.descriptor);
        if (bestMatch.distance < 0.6) {
          
          console.log('Face matched');
          setFaceMatched(true);
          handleFaceLogin()
        }
      }
    }
    // Repeat the detection every 100 milliseconds
    setTimeout(() => {
      onVideoPlay();
    }, 1000);
  };

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
      // console.log(detection)

    

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


  function handleFaceLogin(){

    const data = {
      username: username,
      faceLoginResult: true
    }
    console.log(data)
    fetch('/api/user/facelogin', {
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

    async function handleAccountRegister(){

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



      
      const blob = await (await fetch(faceImage)).blob();
      const formData = new FormData();
      formData.append('image', blob, 'face.jpg');
      formData.append('username', regUsername);
      formData.append('walletAddress', accountAddress);
      formData.append('walletPrivateKey', key);
      formData.append('name', regName);
      formData.append('email', regEmail);
      formData.append('phone', regPhone);
      formData.append('bios', regBios);
      formData.append('password', regPassword);

      fetch('/api/user/register', {
        method: 'POST',
        body: formData
      }).then((res) => res.json()) 
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

    const handleCaptureFace = async () =>{
      const detection = await captureFace();
      if (!detection) {
        alert('No face detected. Please try again.');
        return;
      }else{
        // console.log(detection)
        // console.log(faceImage)
        
        
          alert('face detected. Proceed to register');
          setRegisterFace(false);
          setRegister(true);
        
        
      }
    }
  
    const captureFace = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      let stream = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    
        // wait for the video to load and play
        await new Promise(resolve => video.onloadedmetadata = resolve);
        video.play();
    

        // draw the current video frame to the canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        // detect the face in the canvas
        const detection = await faceapi.detectSingleFace(canvas);

        // convert the canvas to a data URL and store it in state
        const dataURL = canvas.toDataURL();
        setFaceImage(dataURL)
  
    
        // stop the video stream
        if (stream && stream.getTracks) {
          stream.getTracks().forEach(track => track.stop());
        }
    
        // return the face detection result
        return detection;
      } catch (err) {
        console.error(err);
        if (stream && stream.getTracks) {
          stream.getTracks().forEach(track => track.stop());
        }
        return null;
      }
    };


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
            (!accountLogin && !faceLogin && !register && !registerFace)  &&
            <Card maxW='lg' className='container bg-white' >
              <CardBody>
                <Center>
                  <img
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
                  <Button className='container' variant='ghost' colorScheme='blue' onClick={() => setRegisterFace(true)}>
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


                    {
                      faceLoginClicked &&
                      <Box id="cam" w='500px' h='320px'>
                      <video ref={videoRef}  autoPlay muted id="video" width="400" height="300" className="border rounded-lg" onPlay={onVideoPlay}>  </video>
                      <canvas ref={canvasRef} id="canvas" width="400" height="300" className="border rounded-lg" ></canvas>
                      <CircularProgress isIndeterminate color='green.300' />
                      </Box>
                    }
                      
                    
                    <button onClick={handleFaceLoginClicked} id='faceLoginClicked'>Login</button>

                     
         
                    
                  </Stack>
                  
                </Box>
              </Stack>
            </Flex>
              


          }{
            registerFace  &&
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
                  <Heading fontSize={'4xl'} style={{color:'#FF008C'}} className="mb-3" >Face Register</Heading>
                  <Text fontSize={'lg'} color={'gray.600'} className="fw-bold">
                    Please Show your face here ✌️
                  </Text>
                </Stack>
                <Box
                  rounded={'lg'}
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  p={8}>
                  <Stack spacing={4}>
                    


                    <Box id="cam" w='500px' h='320px'>
                      <video ref={videoRef} autoPlay muted id="video" width="400" height="300" className="border rounded-lg" >  </video>
                      <canvas ref={canvasRef} id="canvas" width="400" height="300" className="border rounded-lg" ></canvas>

                    </Box>
                      
                    
                    
                    <button onClick={handleCaptureFace}>Capture</button>
                    
                    
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
