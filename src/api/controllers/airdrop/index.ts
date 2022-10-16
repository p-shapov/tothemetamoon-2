import { api } from 'api/core';

export const getAirdropProof = async (address: string) => {
  const res = await api.get<string>(`/merkle-proof/airdrop/${address}`);

  const proof = JSON.parse(res.data);

  return proof;
};
