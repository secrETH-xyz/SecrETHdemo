import type { NextPage } from 'next'
import React, { useState, useEffect} from 'react'
import { Wallet } from 'ethers'
import { ethers } from 'ethers'
import abi from '../contract/secreth.json'

const Home: NextPage = () => {
    // Constants
    const URL = 'http://localhost:8545'
    const FULL_CIPHER = "84116017433852687828895522314957936859461010955255529249098901597640284918339 30149203042391427187371067948643221044877031948214106631492743117600188316053 77063901856809388108223321875715773075060211935425309996466425831622105809698 43315634458797706148770100740942572846951328506295358045188727020747998120109 b'\\xc6JH\\x13.\\xf4\\x99ms[t\\xd8tKM\\x9b\\xbf2\\xf6VSm6e\\xaa5\\xaf\\x0cVe\"\\x83Y\\ra\\x11+\\x7fk\\xb0%\\x9d%\\xa9<^#d\\x8byu\\xfe\\xb8\\xe1\\x03\\xf4\\xb9u\\xab\\xf6\\xe0\\x10X\\xf3G\\x06\\xd8\\xcdO&s]\\x12\\xa1\\xa0\\x1d'"
    const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    const PRIVATE_KEYS = [
        'c49623bcd9f13392a3845117f824d51b119c1b92d932a68406fc5e0ac09143e9',
        '0781c46883db647fc2681f456346495390a051ca352fdb3b59e3df2c3a06a8a1',
        'a745a75d11fc5fa783874bea4d302a81b8a0f1d5c792a5fa4a1d27432a73b9af',
    ]

    // Web3 variables
    const _provider = new ethers.providers.JsonRpcProvider(URL)
    const _wallets = PRIVATE_KEYS.map(key => { return new Wallet(key, _provider) })
    const _contract = new ethers.Contract(CONTRACT_ADDRESS, abi, _wallets[0])

    // State variables
    const [addresses, setAddresses] = useState<Array<string>>()
    const [currentAccount, setCurrentAccount] = useState<number>(-1)
    const [cipherInput, setCipherInput] = useState<string>('')
    const [partialDecryptions, setPartialDecryptions] = useState<Array<string>>([])
    const [completeDecryption, setCompleteDecryption] = useState('tests')

    useEffect(() => {
        const bootstrapAsync = async () => {
            const addresses = await Promise.all([
                _wallets[0].getAddress(),
                _wallets[1].getAddress(),
                _wallets[2].getAddress(),
            ])
            setAddresses(addresses)
        }

        bootstrapAsync()
    }, [])

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

    const hitDecryptEndpoint = async (encrypted_message: string): Promise<string> => {
        const body = { encrypted_message }
        const res = await fetch('http://127.0.0.1:3001/decrypt', {
          method: 'POST',
          body: JSON.stringify(body) // body data type must match "Content-Type" header
        })
        const resText = await res.text()
        return parseDecryptEndpointResponse(resText)
    }

    async function individualSignerDecrypt(cipher: string) {
        if (currentAccount < PRIVATE_KEYS.length - 1) {
            const res = await hitDecryptEndpoint(cipher)
            console.log(res)
            setPartialDecryptions([...partialDecryptions, res])
            setCurrentAccount(currentAccount + 1)
        }
    }

    async function _submitPartialDecrypion(signerIndex: number, cipher: string, partialDecryptionX: string, partialDecryptionC1_x: string, partialDecryptionC1_y: string) {
        const secreth = _contract.connect(_wallets[signerIndex]);
        const res = await secreth.submitPartialDecryption(cipher, partialDecryptionX, partialDecryptionC1_x, partialDecryptionC1_y, {gasPrice: 2e9, gasLimit: 5e5});
        console.log(res)
        setCompleteDecryption(res)
    }

    return (
        <div className="w-full h-full px-16 py-8">
            <div className="flex flex-row pt-16">
                <div className="w-2/3">
                </div>

                <div className="w-1/3">
                    <p className="text-xl">Account</p>
                    <p className="text-md">
                        { addresses ? addresses[currentAccount] : 'No address' }
                    </p>
                </div>
            </div>

            <div className="flex flex-row pt-16">
                <div className="w-2/3 flex flex-col justify-between">
                    <div>
                        <p className="text-xl pb-0">Ciphertext</p>
                        <p className='text-sm pt-0 overflow-auto w-4/5'>{FULL_CIPHER}</p>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <p className="text-xl">Submit partial decryption</p>
                        <div className="flex flex-row">
                            <input 
                                className="border-2 border-grey rounded-l-xl h-16 w-2/3 text-xl pl-2 -ml-2"
                                onChange={delta => setCipherInput(delta.target.value)}
                            />
                            <button 
                                className="w-2/3 bg-blue-500 hover:bg-blue-400 rounded-r-xl text-white"
                                onClick={() => individualSignerDecrypt(cipherInput)}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-1/3 flex flex-col justify-between">
                    <div>
                        <div className="border-2 border-grey justify-between flex flex-col rounded-xl h-72">
                            <div></div>
                            <div>
                                <p>
                                {
                                    (partialDecryptions && currentAccount >= 0) ? partialDecryptions[currentAccount] : 'pending...'
                                }
                                </p>
                                <div className="h-0.5 w-full bg-gray-200"></div>
                            </div>
                            <div>
                                <p>
                                {
                                    (partialDecryptions && currentAccount >= 1) ? partialDecryptions[currentAccount] : 'pending...'
                                }
                                </p>
                                <div className="h-0.5 w-full bg-gray-200"></div>
                            </div>
                            <div>
                                <p>
                                {
                                    (partialDecryptions && currentAccount >= 2) ? partialDecryptions[currentAccount] : 'pending...'
                                }
                                </p>
                                <div className="h-0.5 w-full bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row pt-16">
                <div className="w-2/3">
                </div>

                <div className="w-1/3 flex flex-col">
                    <p className="text-xl pt-4">Complete decryption</p>
                    <p className="text-8xl">{completeDecryption}</p>
                </div>
            </div>
        </div>
    )
}

export default Home
