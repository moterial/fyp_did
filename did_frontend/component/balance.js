import React, {useState, useEffect} from 'react'
import { Badge,Stack } from '@chakra-ui/react'
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Image,
    Button, ButtonGroup,
    Box,
    useDisclosure,
    Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup, Input, InputRightElement, InputLeftElement
  } from '@chakra-ui/react'
  import {CheckIcon } from '@chakra-ui/icons'
  import jwt_decode from 'jwt-decode'





const styles = {
    balance: {
        width: '80%',
        borderRadius: '10px',
        height: 'auto',
        padding: '10px',
        position: 'relative',
        top: '50%',
        zIndex: '1',
    }
}

export default function Balance({user,balance,account}){
//   const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
//   const [account, setAccount] = useState('')
  const [amount, setAmount] = useState(0)




  useEffect(() => {
    //get the balance from local storage

    // console.log('user: '+user)

    //     const account = localStorage.getItem('addressAccount')
    // //     const balance = localStorage.getItem('balance')
        
    //     setAccount(account)
    //     setBalance(balance)
    //     setLoading(false)

    }, [])

    
    const handleTopUp = () => {
        console.log('top up')
        //
        console.log('top up amount: '+amount)
        console.log('top up account: '+account)
        if(confirm('Are you sure you want to top up?')){
            //top up the balance
            //get the token from local storage
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token)
            

            fetch('/api/user/topup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer '+token
                },
                body: JSON.stringify({
                    account: account,
                    amount: amount,
                    username: decoded.username.username
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.status == "success"){
                    //reload the page
                    //set the local storage balance
                    // const balance1 = balance
                    // setBalance(balance1+amount)
                    localStorage.setItem('balance', balance+amount)
                    

                    window.location.reload()

                }else{
                    alert(data.message)
                }
            })

        }else{
            onClose()
        }
        
    }

    const handleAmountChange = (e) => {
        setAmount(e.target.value)
    }




  return (
    <div className="balance container bg-white " style={styles.balance}>
        <Stat>
        <StatLabel>Balance</StatLabel>
        <StatNumber>

            {/* {
                loading ? <div className='d-inline-flex h5'>
                <Image src='https://cdn-icons-png.flaticon.com/512/6001/6001368.png' borderRadius='full' boxSize='25px'/>
                Loading
                </div> : 
                <div className='d-inline-flex h5'>
                    <Image src='https://cdn-icons-png.flaticon.com/512/6001/6001368.png' borderRadius='full' boxSize='25px'/>
                    {balance} ETH
                </div>
            } */}

            {
                balance ? 
                <>
                <div className='d-inline-flex h5'>
                    <Image src='https://cdn-icons-png.flaticon.com/512/6001/6001368.png' borderRadius='full' boxSize='25px'/>
                    {balance} ETH
                    </div> 
                <div className='d-inline-flex' style={{fontSize:'10px',wordWrap:'anywhere'}}>
                    wallet address: {account}
                </div>
                </>
                :
                <div className='d-inline-flex h5'>
                <Image src='https://cdn-icons-png.flaticon.com/512/6001/6001368.png' borderRadius='full' boxSize='25px'/>
                0 ETH
                </div>
            }
   
        </StatNumber>
        <StatHelpText onClick={onOpen} style={{textDecoration: 'underline', cursor:'pointer' }}>click to top up ETH</StatHelpText>
        
        </Stat>

        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Top Up</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <InputGroup>
                <InputLeftElement
                pointerEvents='none'
                color='gray.300'
                fontSize='1.2em'
                children='Eth'
                />
                <Input placeholder='Enter amount' type='number' value={amount} onChange={handleAmountChange}/>
                {/* <InputRightElement children={<CheckIcon color='green.500' />} /> */}
            </InputGroup>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
                <Button onClick={handleTopUp} colorScheme='green'>FaceID Confirm</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
    )


}