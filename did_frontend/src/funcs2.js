import Did from '../build/contracts/Did.json'
import Web3 from 'web3'
const contract = require("@truffle/contract");
const  Web3HDWalletProvider = require("@truffle/hdwallet-provider");


export const loadUserProfile = async (privateKey,userAddress) => {
    await loadWeb3(privateKey)

    const {didContractDeployed,certificates,profile} = await loadContract(userAddress)
    return {didContractDeployed,certificates,profile}
}

export const approvedCertificate = async (privateKey,userAddress,index) => {
    await loadWeb3(privateKey)
    const {didContractDeployed} = await loadContract(userAddress)
    await didContractDeployed.approveCertificate(userAddress,index)
    return true
}

const loadProfile = async (didContractDeployed, addressAccount) => {

    console.log(addressAccount)
    const profile = await didContractDeployed.getUserProfile(addressAccount)
    console.log(profile)
    const certificates = await didContractDeployed.getUserCertificate(addressAccount)
    console.log(certificates)
    return {certificates,profile}
    
}



const loadContract = async (addressAccount) => {
    const didContract = contract(Did)
    // console.log(didContract)
    didContract.setProvider(web3.currentProvider)
    const  didContractDeployed = await didContract.deployed()
    // console.log(didContractDeployed)
    const {certificates,profile} = await loadProfile(didContractDeployed, addressAccount)
    return {didContractDeployed,certificates,profile}
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