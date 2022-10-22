import { ENV } from 'shared/constants/env';

import { WhitelistType } from './types';

const presaleRequestsId = ENV.SPREADSHEET_PRESALE_REQUESTS_ID;
const airdropRequestsId = ENV.SPREADSHEET_AIRDROP_REQUESTS_ID;
const presaleWhitelistId = ENV.SPREADSHEET_PRESALE_WHITELIST_ID;
const airdropWhitelistId = ENV.SPREADSHEET_AIRDROP_WHITELIST_ID;

export const spreadsheetRequestIds: Record<WhitelistType, string> = {
  airdrop: airdropRequestsId,
  presale: presaleRequestsId,
};

export const spreadsheetWhitelistIds: Record<WhitelistType, string> = {
  airdrop: airdropWhitelistId,
  presale: presaleWhitelistId,
};

export const spreadsheetSubscriptionsId = ENV.SPREADSHEET_SUBSCRIPTIONS_ID;
