import { api } from 'api/core';

export const getPresaleProof = async (address: string) => {
  const res = await api.get<string>(`/merkle-proof/presale/${address}`);

  const proof = JSON.parse(res.data);

  return proof;
};
