import ethers from 'ethers'
import abi2 from '../contract/secreth.json'

export class SecrethContract {

    address
    provider
    contract
    private static abi = abi2

    constructor (address: string, provider: ethers.providers.JsonRpcProvider) {
        this.address = address
        this.provider = provider
        try {
            this.contract = new ethers.Contract(this.address, Contract.abi, provider.getSigner());
        } catch (e) {
            console.log(e)
        }

    }

    async register(userAddress: string, cipher: string): Promise<boolean> {
        if (this.contract) {
            try {
                userAddress = userAddress.toLowerCase()
                const secreth = this.contract.connect(this.provider.getSigner(userAddress))
                await secreth.register(cipher, {value: 1000, gasLimit: 3e7})
                return true
            } catch (e) {
                console.log(e)
            }
        }
        return false
    }

    async submitPartialDecryption(signerAddress: string, cipher: string, partialDecryptionX: string, partialDecryptionC1_x: string, partialDecryptionC1_y: string): Promise<boolean> {
        if (this.contract) {
            try {
                signerAddress = signerAddress.toLowerCase()
                const secreth = this.contract.connect(this.provider.getSigner(signerAddress))
                await secreth.submitPartialDecrypion(cipher, partialDecryptionX, partialDecryptionC1_x, partialDecryptionC1_y, {gasLimit: 3e7})
                return true
            } catch (e) {
                console.log(e)
            }
        }
        return false
    }
}