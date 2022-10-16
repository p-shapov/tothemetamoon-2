import { api } from 'api/core';

import { WhitelistType } from 'services/Spreadsheets/types';

export const getProof = async (type: WhitelistType, address: string) => {
  const res = await api.get<string>(`/merkle-proof/${type}/${address}`);

  const proof = JSON.parse(res.data);

  return proof;
};
