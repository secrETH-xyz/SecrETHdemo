import type { NextPage } from 'next'
import React, { useState, useEffect} from 'react'
import ethers from 'ethers'

const Home: NextPage = () => {

    // State variables
    const [fullCipher, setFullCipher] = useState('secretttt')
    const [inputCipher, setInputCipher] = useState('')
    const [currentAccount, setCurrentAccount] = useState('0xaf3rwr23radsfasdf134134')

    const [partialDecryption1, setPartialDecryption1] = useState()
    const [partialDecryption2, setPartialDecryption2] = useState()
    const [partialDecryption3, setPartialDecryption3] = useState()
    const [partialDecryption4, setPartialDecryption4] = useState()
    const [partialDecryption5, setPartialDecryption5] = useState()

    const [completeDecryption, setCompleteDecryption] = useState('adfadsf')

    // When page opens
    useEffect(() => {
        const bootstrapAsync = async () => {
            const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

            
        }
        
    }, [])

    return (
        <div className="w-full h-full px-16 py-8">
            <div className="flex flex-row pt-16">
                <div className="w-2/3">
                </div>

                <div className="w-1/3">
                    <p className="text-xl">Account</p>
                    <p className="text-md">{currentAccount}</p>
                </div>
            </div>

            <div className="flex flex-row pt-16">
                <div className="w-2/3 flex flex-col justify-between">
                    <div>
                        <p className="text-xl pb-0">Ciphertext</p>
                        <p className='text-8xl pt-0'>{fullCipher}</p>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <p className="text-xl">Cipher input</p>
                        <input 
                            className="border-2 border-grey rounded-xl h-16 w-2/3"
                            onChange={delta => setInputCipher(delta.target.value)}
                        />
                    </div>
                </div>

                <div className="w-1/3 flex flex-col justify-between">
                    <div>
                        <div className="border-2 border-grey justify-between flex flex-col rounded-xl h-72">
                            <div>
                                <p>{partialDecryption1}</p>
                            </div>
                            <div>
                                <p>{partialDecryption2}</p>
                                <div className="h-0.5 w-full bg-gray-200"></div>
                            </div>
                            <div>
                                <p>{partialDecryption3}</p>
                                <div className="h-0.5 w-full bg-gray-200"></div>
                            </div>
                            <div>
                                <p>{partialDecryption4}</p>
                                <div className="h-0.5 w-full bg-gray-200"></div>
                            </div>
                            <div>
                                <p>{partialDecryption4}</p>
                                <div className="h-0.5 w-full bg-gray-200"></div>
                            </div>
                            <div>
                                <p>{partialDecryption5}</p>
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
