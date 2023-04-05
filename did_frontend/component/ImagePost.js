import {useEffect, useState} from 'react'
import { Box, useToast,Flex, Heading, Text, Avatar,Tooltip, IconButton, Card, CardHeader, CardBody, Image,CardFooter,Button} from '@chakra-ui/react'
import { BsThreeDotsVertical} from 'react-icons/bs'
import{BiLike,BiChat,BiShare } from 'react-icons/bi'
import {FaEthereum} from 'react-icons/fa'


export function ImagePost({post,contract,addressAccount}){

    //get the post data from the parent component
    const posts = post
    const [imageHash , setImageHash] = useState('')
    const [caption , setCaption] = useState('')
    const [tips , setTips] = useState('')
    const [author , setAuthor] = useState('')
    const [address , setAddress] = useState('')
    const [account , setAccount] = useState('')
    const [postId, setPostId] = useState('')
    const toast = useToast()
    const [expanded, setExpanded] = useState(false);    
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([
        { author: "Alice", content: "This is the first comment" },
        { author: "Bob", content: "This is the second comment" },
    ]);

    function handleCommentChange(event) {
        setComment(event.target.value);
    }

    async function handlePostComment () {
        console.log("My comment input is",comment)
        contract.addComment(posts.id, comment, { from: account })
        .then((result) => {
            console.log(parseInt(result))
            toast({
                title: 'Comment added.',
                description: "We've added your comment.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            setTimeout(() => {
                window.location.reload()
            }, 500);
        })
        
    }

  function renderComments() {
    return comments.map((comment, index) => (
      <div key={index}>
        <strong>{comment.author}:</strong> {comment.content}
      </div>
    ));
  }
    useEffect(() => {
        // console.log("CHILDREN: ",posts)
        //console log the data type of the posts

        if(posts){
            //get the image hash from the posts
            setAccount(addressAccount)
            contract.DidName(posts.author).then((name) => {
                setAuthor(name)
                console.log("author name: ",name)
            })
            
            setImageHash(posts.hash)
            //get the caption from the posts
            setCaption(posts.description)
            //get the tips from the posts
            setTips(posts.tipAmount.toString())
            setAddress(posts.author)
         
        }

    }, [])

    const handleTips = async(posts) => {
        console.log(posts.id.toString())
        console.log(posts.author)
        console.log(account)
        if(account.toLowerCase() != posts.author.toLowerCase()){
        window.web3.eth.sendTransaction({from: account, to: posts.author, value: window.web3.utils.toWei('0.5', "ether")})
        const result = await contract.tipImageOwner(posts.id,(window.web3.utils.toWei('0.5', "ether")), {from: account} )
        console.log(result)
        toast({
                    title: 'Tip sent.',
                    description: "We've sent your tip.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
         })
         setTimeout(() => {
            window.location.reload()
        }, 500);
    }else{
        toast({
            title: 'Error.',
            description: "You can't tip yourself.",
            status: 'error',
            duration: 9000,
            isClosable: true,
            })
    }
        

    };  

    
    
    return (
    <>
    <Card maxW='md'>
        <CardHeader>
            <Flex spacing='4'>
            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                <Avatar name='Segun Adebayo' src='https://cdn-icons-png.flaticon.com/512/9069/9069049.png' />
                <Box>
                    <h1 className='h6'>
                        <a href={`/dashboard/profile/${address}`} className='text-dark'>{
                            author? author : 'Anonymous'
                        
                        }</a>
                    </h1>
                    <div className='row'>

                        <p className='' style={{fontSize:'10px'}}>{address}</p>
                    </div>
                    
                </Box>
            </Flex>
            <IconButton
                variant='ghost'
                colorScheme='gray'
                aria-label='See menu'
                icon={<BsThreeDotsVertical />}
            />
            </Flex>
        </CardHeader>
        <CardBody>
            <Text >
            {caption}
            </Text>
        </CardBody>
        {
            imageHash &&
            <Image
                objectFit='cover'
                src={`https://fypdid.infura-ipfs.io/ipfs/${imageHash}`}
            />
        }
        <h1 className='fw-bold mt-2'>TIPS: {window.web3.utils.fromWei(tips, 'ether')} ETH </h1>
        <CardFooter
            justify='space-between'
            flexWrap='wrap'
            sx={{
            '& > button': {
                minW: '136px',
            },
            }}
        >   
            
            <Button flex='1' variant='ghost' leftIcon={<FaEthereum />} onClick={event => handleTips(posts)} >
            Tips
            </Button>
            <Button flex='1' variant='ghost' leftIcon={<BiChat />} onClick={() => setExpanded(!expanded)}>
            Comment
            </Button>

            <div style={
                {margin: 'auto'}
            }>
            
                {expanded && (
                    <div >
                        <div style={
                            //make its width fit the parent
                            {width: '100%',
                            marginBottom: '10px'
                        }

                        }>
                            <textarea value={comment} onChange={handleCommentChange} style={

                                {border: '1px solid #ccc', borderRadius: '4px', padding: '5px', width: '100%'}
                            } />
                            <button onClick={handlePostComment} style={{
                                //make it look like a button
                                background: '#ccc',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                                
                            }}>Post Comment</button>
                        </div>
                    {renderComments()}
                
                    </div>
                )}
            </div>
            
        </CardFooter>
    </Card>
    </>

    )





}