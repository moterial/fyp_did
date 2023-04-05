import Did from '../build/contracts/Did.json'
import Web3 from 'web3'
const contract = require("@truffle/contract");
const  Web3HDWalletProvider = require("@truffle/hdwallet-provider");


export const load = async (privateKey) => {
    await loadWeb3(privateKey)
    const addressAccount =  await loadAccount()
    const {didContractDeployed,certificates,profile,posts} = await loadContract(addressAccount)
    return {addressAccount,didContractDeployed,certificates,profile,posts}
}



const loadProfile = async (didContractDeployed, addressAccount) => {
    const certificateCount = await didContractDeployed.getCertificateCount()
    const certificates = [];
    for (var i = 0; i <= certificateCount; i++) {
        const certificate = await didContractDeployed.certificateMap(addressAccount, i)
        certificates.push(certificate)
    }
    const profile = await didContractDeployed.retrieve({from: addressAccount})
    const imgCount = await didContractDeployed.getImageCount()
    const posts = [];
    for (var i = 0; i < imgCount; i++) {
        console.log('IMGCOUNT',parseInt(imgCount))
        let image = await didContractDeployed.imageMap(i)
        let commentCount = image.commentCount
        console.log('COMMENTCOUNT',parseInt(commentCount))
        for (var j = 0; j < commentCount; j++) {
            let {comment,author} = await didContractDeployed.getComment(i,j)
            console.log('COMMENT',comment,author)
        }
        
        posts.push(image)

    }
    console.log(posts)
    return {certificates,profile,posts}
    
}



const loadContract = async (addressAccount) => {
    const didContract = contract(Did)
    // console.log(didContract)
    didContract.setProvider(web3.currentProvider)
    const  didContractDeployed = await didContract.deployed()
    // console.log(didContractDeployed)
    const {certificates,profile,posts} = await loadProfile(didContractDeployed, addressAccount)
    return {didContractDeployed,certificates,profile,posts}
}

const loadAccount = async () => {
    const account = await web3.eth.getCoinbase()
    return account
}
const loadWeb3 = async (privateKey) => {
     // use Web3HDWalletProvider to connect to the blockchain
    const provider = new Web3HDWalletProvider(privateKey,"HTTP://127.0.0.1:7545")
        
    const web3 = new Web3(provider)
    window.web3 = web3


        

}