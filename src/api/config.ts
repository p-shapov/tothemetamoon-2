import { AxiosRequestConfig } from 'axios';

import { ENVIRONMENT } from 'shared/constants/environment';

export const axiosConfig: AxiosRequestConfig = {
  baseURL: ENVIRONMENT.BASE_URL,
};
