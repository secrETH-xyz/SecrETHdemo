import type { NextPage } from 'next'
import React, { useState, useEffect} from 'react'
import Dropdown from 'react-dropdown';


import { Wallet } from 'ethers'
import { ethers } from 'ethers'
import abi from '../contract/secreth.json'
import { Console } from 'console';

const Home: NextPage = () => {
    const URL = 'http://localhost:8545'
    const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    const USER_KEY = "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e"
    const SIGNERS_KEYS = ["0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6", "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a", "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba"]

    // Signers
    const provider = new ethers.providers.JsonRpcProvider(URL)
    const signers = [new Wallet(SIGNERS_KEYS[0], provider), new Wallet(SIGNERS_KEYS[1], provider), new Wallet(SIGNERS_KEYS[2], provider)]
    const user = new Wallet(USER_KEY, provider)

    // 
    const [ciphertext, setCiphertext] = useState<string>('adsfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd')
    const [completedDecryption, setCompletedDecryption] = useState<string>('')

    const [signerIndex, setSignerIndex] = useState<number>(0);
    const [signerCount, setSignerCount] = useState<number>(-1);
    const [partialDecryptionOutput, setPartialDecryptionOutput] = useState<string>('')
    const [partialDecryptions, setPartialDecryptions] = useState<Array<string>>([])
    // const options = [

    //     'User', 'Signer 1', 'Signer 2', 'Signer 3', 'Signer 4', 'Signer 5'
    // ]
    const options = [
        { label: 'User', value: -1 },
        { label: 'Signer 1', value: 0 },
        { label: 'Signer 2', value: 1 },
        { label: 'Signer 3', value: 2 },
        { label: 'Signer 4', value: 3 },
        { label: 'Signer 5', value: 4 },
    ]

    let SecrETH = new ethers.Contract(CONTRACT_ADDRESS, abi, user)

    useEffect(() => {
        const asyncWrapper = async () => {
            const response = await fetch('http://localhost:3001/get-ciphertext')
            const textResponse = await response.text()
            setCiphertext(textResponse)
        }
        
        asyncWrapper()
        
    }, [])
    
    const changeCurrentWallet = (index: number) => {
        // const index = parseInt(newWallet.split(' ')[-1]) - 1
        console.log(index)
        setSignerIndex(index)
    }

    function BasicExample() {
        return (
            <Dropdown options={options} placeholder='User' onChange={delta => changeCurrentWallet(parseInt(delta.value))}/>
        );
      }
      

    // 2nd thing you call, when corresponding button is clicked
    async function _register(cipher: string) {
        SecrETH = await SecrETH.connect(user);
        let x = await SecrETH.register(cipher, {value: 1000, gasPrice: 2e9, gasLimit: 1e5});
        console.log(x)
    }

    async function _requestDecrypt(cipher: string) {
        SecrETH = await SecrETH.connect(user);
        let x = await SecrETH.decrypt(cipher, false, {gasPrice: 2e9, gasLimit: 1e5});
        console.log(x)
      }

    async function computePartialDecrypt(_signerIndex: number) {
        const res = await fetch('http://localhost:3001/compute-partial-decryption', {
            method:  'POST',
            body: JSON.stringify({ signer_index: _signerIndex })
        })

        let text = await res.text()
        text = parseDecryptEndpointResponse(text)

        partialDecryptions[signerIndex || 0] = text

        setPartialDecryptionOutput(text)

        return text
    }

    const parseDecryptEndpointResponse = (text: any): string => {
        let res = ''
        for (let i = 0; i < text.length; i++) {
            const curChar = text.charAt([i])
            if (!isNaN(parseInt(curChar))) {
                res = res.concat(curChar)
            }
        }
    
        return res.substring(1, res.length)
    }

    async function submitPartialDecryt(signerIndex: number, cipher: string, partialDecryptionX: string, partialDecryptionC1_x: string, partialDecryptionC1_y: string) {
        SecrETH = await SecrETH.connect(signers[signerIndex]);
         let x = await SecrETH.submitPartialDecryption(cipher, partialDecryptionX, partialDecryptionC1_x, partialDecryptionC1_y, {gasPrice: 2e9, gasLimit: 5e5});
          console.log(x)
      }

    async function decryptMessage() {
        const res = await fetch('http://localhost:3001/decrypt-message', {
            method: 'GET'
        })
        let text = await res.text()

        setCompletedDecryption(text)
        return text
    }
 
    return (
        <div className='w-full h-full px-16'>
            <div className='pt-8 flex flex-row space-x-8 align-middle'>
                <div className='w-2/3 flex flex-col'>
                    <p className='text-4xl'>SecrETH</p>

                </div>
                {
                    BasicExample()
                }
            </div>

            <div className='pt-8'>
                <div className='w-2/3 flex flex-col'>
                    <p className='text-xl'>Ciphertext</p>
                </div>
                <div className='w-1/3'>
                    
                </div>
            </div>

            <div className='flex flex-row space-x-8'>
                <div className='w-2/3 flex flex-col space-y-4'>
                    <div>
                        <p className='text-md h-48 border-2 overflow-auto'>{ciphertext}</p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <button 
                            className='w-36 h-8 bg-blue-600 hover:bg-blue-400 text-white text-sm rounded-md'
                            onClick={() => _register(ciphertext)}
                        >
                                Register
                            </button>
                        <button 
                            className='w-36 h-8 bg-blue-600 hover:bg-blue-400 text-white text-sm rounded-md'
                            onClick={() => _requestDecrypt(ciphertext)}
                        >
                            Request decryption
                        </button>
                    </div>
                    <div className='space-y-4'>
                        <p className='h-48 border-2 break-normal overflow-auto'>{partialDecryptionOutput}</p>
                        <div className='flex flex-row space-x-4'>
                            <button 
                                className='w-72 h-8 bg-blue-600 hover:bg-blue-400 text-white text-sm rounded-md'
                                onClick={() => computePartialDecrypt(signerIndex || 0)}
                            >
                                Compute and submit partial decryption
                            </button>
                        </div>
                    </div>
                </div>
                <div className='w-1/3 flex flex-col justify-between'>
                    <div className='border-2 border-grey justify-between flex flex-col rounded-xl h-72'>
                        <div></div>
                        <div>
                            <p className='overflow-auto pb-2'>
                                {
                                    (partialDecryptions[0]) ? partialDecryptions[0] : 'pending...'
                                }
                            </p>
                            <div className="h-0.5 w-full bg-gray-200"></div>
                        </div>
                        <div>
                            <p className='overflow-auto pb-2'>
                                {
                                    (partialDecryptions[1]) ? partialDecryptions[1] : 'pending...'
                                }
                            </p>
                            <div className="h-0.5 w-full bg-gray-200"></div>
                        </div>
                        <div>
                            <p className='overflow-auto pb-2'>
                                {
                                    (partialDecryptions[2]) ? partialDecryptions[2] : 'pending...'
                                }
                            </p>
                            <div className="h-0.5 w-full bg-gray-200"></div>
                        </div>
                        <div>
                            <p className='overflow-auto pb-2'>
                                {
                                    (partialDecryptions[3]) ? partialDecryptions[3] : 'pending...'
                                }
                            </p>
                            <div className="h-0.5 w-full bg-gray-200"></div>
                        </div>
                        <div>
                            <p className='overflow-auto pb-2'>
                                {
                                    (partialDecryptions[4]) ? partialDecryptions[4] : 'pending...'
                                }
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col pt-6'>
                        <p className='text-xl'>Secret Message:</p>
                        <p>{completedDecryption}</p>
                        <button 
                            className='bg-blue-600 hover:bg-blue-400 text-white rounded-md w-48 h-8 text-sm mt-8'
                            onClick={() => decryptMessage()}
                        >
                            Complete Decryption
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home