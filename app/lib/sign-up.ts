import { FC_SERVERLESS_WORKER, FC_ID_REGISTRY_CONTRACT, FC_KEYS_CONTRACT } from '~/lib/constants'
import type { BrowserProvider } from 'ethers/providers'
import { registryABI } from '~/lib/ABIs/fc-registry'
// import { keyABI } from '~/lib/ABIs/fc-keys'
import { fullKeyABI as keyABI } from '~/lib/ABIs/full/fc-keys'
import { Contract, parseEther, hexlify } from 'ethers'
import { USERNAME_PROOF_EIP_712_TYPES } from './eth-sign-types'


type TFnameValid = {
    valid: boolean
    error: string
}

type TSignUpData = {
    keyData: {metadata: string ,privateKey: string, publicKey: string, fid: number}
    error: string
}

type TSignUpPrice = {
    price: string
    error: string
}

export const getSignUpPrice = async (): Promise<TSignUpPrice> => {
    try {
        const req = await fetch(`${FC_SERVERLESS_WORKER}/get-price`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (req.ok) {
            return (await req.json()) as TSignUpPrice
        }
        console.error(`Failed to get signup price: ${await req.text()}`)
        return { price: '', error: 'Failed to get signup price' }
    } catch (error) {
        console.error('Failed to get signup price', error)
        return { price: '', error: 'Failed to get signup price' }
    }
}

export const getSignUpData = async (address: string): Promise<TSignUpData>  => {
    try {
        const req = await fetch(`${FC_SERVERLESS_WORKER}/get-key/${address}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (req.ok) {
            return (await req.json()) as TSignUpData
        }
        console.error(`Failed to get signup data: ${await req.text()}`)
        return { error: 'Failed to get signup data' } as TSignUpData
    } catch (error) {
        console.error('Failed to get signup data', error)
        return { error: 'Failed to get signup data' } as TSignUpData
    }
}

export const getWCKeyData = async (address: string, key: string) => {
    try {
        const req = await fetch(`${FC_SERVERLESS_WORKER}/warpcast-key/${address}/${key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (req.ok) {
            return (await req.json()) as TSignUpData
        }
        console.error(`Failed to get signup data: ${await req.text()}`)
        return { error: 'Failed to get signup data' } as TSignUpData
    } catch (error) {
        console.error('Failed to get signup data', error)
        return { error: 'Failed to get signup data' } as TSignUpData
    }
}


export const validateFname = (fname: string): TFnameValid => {
    if (fname.length < 2) {
        return { valid: false, error: 'Fname must be at least 2 characters' }
    }
    if (fname.length > 16) {
        return { valid: false, error: 'Fname must be at most 16 characters' }
    }
    if (fname[0].match(/[a-zA-Z]+/) === null) {
        return { valid: false, error: 'Fname must start with a letter' }
    }
    if(fname[fname.length - 1].match(/[a-zA-Z0-9]+/) === null) {
        return { valid: false, error: 'Fname must end with a letter or number' }
    }
    const regex = /^[a-zA-Z0-9]*$/
    if (!regex.test(fname)) {
        return { valid: false, error: 'First name must pass regex /^[a-zA-Z0-9]*$/' }
    }
    return { valid: true, error: '' }
}

export const checkFnameAvailability = async (fname: string) : Promise<boolean> => {
    try {
        const fnameReq = await fetch(`https://fnames.farcaster.xyz/transfers?name=${fname}`)
        if (fnameReq.ok) {
            const data = await fnameReq.json()
            return data.transfers.length === 0
        }
        console.error(`Failed to check fname availability: ${await fnameReq.text()}`)
        return false
    } catch (error) {
        console.error('Failed to check fname availability', error)
        return false
    }
}

export const registerFID = async (provider: BrowserProvider, price: string) => {
   const signer = await provider.getSigner()
   const registryContract = new Contract(FC_ID_REGISTRY_CONTRACT, registryABI, signer)

    try {
        const tx =  await registryContract.register(signer.address, {value: parseEther(price)})
        return  {error: false, tx}
    } catch (e) {
        console.error('Failed to register FID', e)
        return {error: true}
    }
}

export const addKey = async (provider: BrowserProvider, keyData: {metadata: string ,privateKey: string, publicKey: string, fid: number}) => {
    const signer = await provider.getSigner()
    const keyContract = new Contract(FC_KEYS_CONTRACT, keyABI, signer)
    try {
        const args = [
            1,
            `0x${keyData.publicKey}`,
            1,
            keyData.metadata
        ]   
        await keyContract.add(...args)
        return {error: false}
    } catch (e: any) {
        if(e.data && keyContract) {
            const decodedError = keyContract.interface.parseError((e as any).data)
            console.error(decodedError)
        }
        return {error: true}
    }
}

export const registerFname = async (fname: string, provider: BrowserProvider, fid: number) => {

    const signer = await provider.getSigner()

    const ts = Math.trunc(Date.now() / 1000) 

    const registerData = {
        "name": fname,
        "from": 0, 
        "to": Number(fid),
        "fid": Number(fid),
        "owner":  signer.address,
        "timestamp": ts,
        "signature": ""
      }

    const message = {
		name: fname,
        owner: signer.address,
        timestamp: BigInt( ts )
	}

    let signature = ""
    try {
    signature = await signer.signTypedData(USERNAME_PROOF_EIP_712_TYPES.domain, { UserNameProof: [...USERNAME_PROOF_EIP_712_TYPES.types.UserNameProof] }, message) 
    } catch (e) {
        console.error('Failed to sign message', e)
        return {error: true, message: 'User denied signature'}
    }
    registerData.signature = signature

    const req = await fetch('https://fnames.farcaster.xyz/transfers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
    })

    const body = await req.text()

    if (req.ok) {
        return {error: false}
    }

    console.error(`Failed to register fname: ${body}`)
 

    if(body.includes('TOO_MANY_NAMES')) {
        return {error: true, message: 'Too many names registered, only 1 name per FID is allowed'}
    }
  
    return {error: true, message: 'Failed to register fname'}
}