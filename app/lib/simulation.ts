import { Contract, Wallet } from 'ethers'
import { fullIdentityABI } from '~/lib/ABIs/full/fc-identity'
import { FC_ID_REGISTRY_CONTRACT } from '~/lib/constants'
import type { BrowserProvider } from 'ethers/providers'

// Can't do register without storage, is disabled at contract level, not mentioned in docs
// probably they don't want fid to get inflated but still, not in the spirit of web3
export const registerFid = async (address: string, provider: BrowserProvider) => {
  const signer = await provider.getSigner()
  const registryContract = new Contract(FC_ID_REGISTRY_CONTRACT, fullIdentityABI, signer)

  try {
 
  const randomAddress = Wallet.createRandom().address

  const args = {
    to: address,
    recovery: randomAddress,
  }

  await registryContract.register(...Object.values(args))
  return true
} catch (e:any) {
    if (e.data && registryContract) {
        const decodedError = registryContract.interface.parseError(e.data);
        console.error(decodedError);
      } else {
        console.error('Error', e);
      }
    }
    return false
}