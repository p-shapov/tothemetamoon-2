import { AxiosRequestConfig } from 'axios';

import { ENV } from 'shared/constants/env';

export const axiosConfig: AxiosRequestConfig = {
  baseURL: ENV.BASE_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
};
