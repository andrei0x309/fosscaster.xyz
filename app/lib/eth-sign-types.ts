export const EIP_712_FARCASTER_DOMAIN = {
    name: "Farcaster Verify Ethereum Address",
    version: "2.0.0",
    // fixed salt to minimize collisions
    salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558",
  } as const;
  
  export const EIP_712_FARCASTER_VERIFICATION_CLAIM = [
    {
      name: "fid",
      type: "uint256",
    },
    {
      name: "address",
      type: "address",
    },
    {
      name: "blockHash",
      type: "bytes32",
    },
    {
      name: "network",
      type: "uint8",
    },
  ] as const;
  
  export const EIP_712_FARCASTER_VERIFICATION_CLAIM_CHAIN_IDS = [...[10], 0];
  
  export const EIP_712_FARCASTER_MESSAGE_DATA = [
    {
      name: "hash",
      type: "bytes",
    },
  ] as const;
  
  export const EIP_712_USERNAME_DOMAIN = {
    name: "Farcaster name verification",
    version: "1",
    chainId: 1,
    verifyingContract: "0xe3be01d99baa8db9905b33a3ca391238234b79d1", // name registry contract, will be the farcaster ENS CCIP contract later
  } as const;
  
  export const EIP_712_USERNAME_PROOF = [
    { name: "name", type: "string" },
    { name: "timestamp", type: "uint256" },
    { name: "owner", type: "address" },
  ] as const;
  
  export const USERNAME_PROOF_EIP_712_TYPES = {
    domain: EIP_712_USERNAME_DOMAIN,
    types: { UserNameProof: EIP_712_USERNAME_PROOF },
  } as const;
  