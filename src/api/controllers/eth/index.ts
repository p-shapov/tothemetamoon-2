import { api } from 'api/core';

export const getEthRateInUsd = async () => (await api.get('/rate/ethereum/usd')).data;
