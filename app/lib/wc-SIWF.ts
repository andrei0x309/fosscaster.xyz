export const constructWarpcastSWIEMsg = ({
    siweUri,
    domain,
    nonce,
    notBefore,
    expirationTime,
    fid,
    custodyAddress
}: {
    siweUri: string,
    domain: string,
    nonce: string,
    notBefore?: string,
    expirationTime?: string,
    fid: number,
    custodyAddress: string
}) => {
    return `${domain} wants you to sign in with your Ethereum account:\n${custodyAddress}\n\nFarcaster Auth\n\nURI: ${siweUri}\nVersion: 1\nChain ID: 10\nNonce: ${nonce}${notBefore ? `\nIssued At: ${notBefore}` : `\nIssued At: ${new Date(Date.now() - 1000).toISOString()}`}${expirationTime ? `\nExpiration Time: ${expirationTime}` : ''}${notBefore ? `\nNot Before: ${notBefore}` : ''}\nResources:\n- farcaster://fid/${fid}`
}
