import { api } from 'api/core';

import { WhitelistType } from 'services/Spreadsheets/types';

import { PostRequestBody } from './type';

export const postRequest = (type: WhitelistType, body: PostRequestBody) =>
  api.post(`/request/${type}`, JSON.stringify(body));
