import { ENVIRONMENT } from 'shared/constants/environment';

import { WhitelistType } from './types';

const presaleRequestsId = ENVIRONMENT.SPREADSHEET_PRESALE_REQUESTS_ID || '';
const airdropRequestsId = ENVIRONMENT.SPREADSHEET_AIRDROP_REQUESTS_ID || '';
const presaleWhitelistId = ENVIRONMENT.SPREADSHEET_PRESALE_WHITELIST_ID || '';
const airdropWhitelistId = ENVIRONMENT.SPREADSHEET_AIRDROP_WHITELIST_ID || '';

export const spreadsheetRequestIds: Record<WhitelistType, string> = {
  airdrop: airdropRequestsId,
  presale: presaleRequestsId,
};

export const spreadsheetWhitelistIds: Record<WhitelistType, string> = {
  airdrop: airdropWhitelistId,
  presale: presaleWhitelistId,
};

export const spreadsheetSubscriptionsId = ENVIRONMENT.SPREADSHEET_SUBSCRIPTIONS_ID || '';
