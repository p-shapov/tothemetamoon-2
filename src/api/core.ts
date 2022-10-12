import { Axios } from 'axios';

import { axiosConfig } from './config';

export const api = new Axios(axiosConfig);
