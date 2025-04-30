import { getBytes } from 'ethers';
import bufferLib from 'buffer';
import type { TWCOnboardingAuth } from '~/types/wc-auth-onboarding'
import { WARPCAST_API_BASE, WARPCAST_API_DEV_TUNNEL } from '~/lib/constants';

const EIP_191_PREFIX = "eip191:";
const isDevTun = typeof window !== 'undefined' && window.location.hostname === 'tun-5173.flashsoft.eu'
const WARPCAST_API = isDevTun ? WARPCAST_API_DEV_TUNNEL : WARPCAST_API_BASE
 

const NO_WALLET = 'NO_WALLET'
const SIG_DENIED = 'SIG_DENIED'
const NO_AUTH_TOKEN = 'NO_AUTH_TOKEN'
export const NO_WARPCAST_SIGNER = 'NO_SIGNER'
const AUTH_SUCCESS = 'AUTH_SUCCESS'

type T_RESULT_GEN_AUTH_TOKEN = {
    success: boolean;
    data: typeof SIG_DENIED  | typeof NO_AUTH_TOKEN | typeof AUTH_SUCCESS | typeof NO_WALLET  | typeof NO_WARPCAST_SIGNER | string;
}
 
function serialize (object: any) {
    if (typeof object === 'number' && isNaN(object)) {
      throw new Error('NaN is not allowed');
    }
  
    if (typeof object === 'number' && !isFinite(object)) {
      throw new Error('Infinity is not allowed');
    }
  
    if (object === null || typeof object !== 'object') {
      return JSON.stringify(object);
    }
  
    if (object.toJSON instanceof Function) {
      return serialize(object.toJSON());
    }
  
    if (Array.isArray(object)) {
      const values: any = object.reduce((t, cv, ci) => {
        const comma = ci === 0 ? '' : ',';
        const value = cv === undefined || typeof cv === 'symbol' ? null : cv;
        return `${t}${comma}${serialize(value)}`;
      }, '');
      return `[${values}]`;
    }
  
    const values: any = Object.keys(object).sort().reduce((t, cv) => {
      if (object[cv] === undefined ||
          typeof object[cv] === 'symbol') {
        return t;
      }
      const comma = t.length === 0 ? '' : ',';
      return `${t}${comma}${serialize(cv)}:${serialize(object[cv])}`;
    }, '');
    return `{${values}}`;
  }

export function createWarpMessage (timestamp?: number) {
    timestamp = timestamp || Date.now();
    const payload = {
        method: "generateToken",
        params: {
            timestamp,
            expiresAt: 1777046287381
        },
    };
    return { message: serialize(payload), payload }
}

export const getCusAuth = (sig: string) => {
  const Buffer = bufferLib.Buffer;
  const sigBase64 = Buffer.from(getBytes(sig)).toString('base64');
  return EIP_191_PREFIX + sigBase64;
}


export const generateApiToken = async (sig: string, payload: Record<string, any>): Promise<T_RESULT_GEN_AUTH_TOKEN> => {
    try {
        const cusAuth = getCusAuth(sig);

        const req = await fetch(`${WARPCAST_API}/auth`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cusAuth}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await req.json();

        if (req.ok) {
            const token = data?.result?.token?.secret;
            if (token) {
                return { success: true, data: token }
            }
            return { success: false, data: NO_AUTH_TOKEN }
        }

        if (!req.ok && data?.errors?.[0]?.reason === 'missing_warpcast_signer') {
            return { success: false, data: NO_WARPCAST_SIGNER }
        }

        return { success: false, data: NO_AUTH_TOKEN }
    } catch (error) {
        console.error('Failed to generate api token', error)
        return { success: false, data: NO_AUTH_TOKEN}
    }
}

export const createWarpMessageForNoSigner = (timestamp?: number) => {
    const wmsg = createWarpMessage(timestamp); 
    return {
        message: wmsg.message,
        payload: {
          authRequest: wmsg.payload,
        }
    }
}

export const genereteApiTokenForNoSigner = async (sig: string, payload: Record<string, any>): Promise<string | null | -1> => {
    try {
        const cusAuth = getCusAuth(sig);
        const req = await fetch(`${WARPCAST_API}/onboarding-state`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cusAuth}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await req.json() as TWCOnboardingAuth;

        if (req.ok) {
            if(data?.result?.token?.secret) {
                return data?.result?.token?.secret
            }
        }
        
        console.error('Failed to generate api token, status:', req.status, String(data))
        return null;
    } catch (error) {
        console.error('Failed to generate api token', error)
        return null;
    }
}
