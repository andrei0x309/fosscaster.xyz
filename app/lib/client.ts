import { WarpCastWebAPI } from './wc-mod'

export const wc = new WarpCastWebAPI()

export const setAuthToken = (token: string) => {
    wc.setToken(token)
}
