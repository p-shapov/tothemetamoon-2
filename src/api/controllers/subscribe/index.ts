import { api } from 'api/core';

export const postSubscribe = (email: string) => api.post(`/subscribe`, email);
