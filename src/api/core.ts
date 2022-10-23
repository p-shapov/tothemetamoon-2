import { Axios } from 'axios';

import { axiosConfig } from './config';

export const api = new Axios(axiosConfig);

api.interceptors.response.use((val) => {
  if (val.status !== 200) {
    // eslint-disable-next-line no-console
    console.error(val.data);
    throw new Error(val.data);
  }

  return val;
});
