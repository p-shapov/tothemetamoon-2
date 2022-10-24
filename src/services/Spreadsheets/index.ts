import { google, sheets_v4 } from 'googleapis';

import { ENV } from 'shared/constants/env';

import { WhitelistType } from './types';
import { spreadsheetRequestIds, spreadsheetSubscriptionsId, spreadsheetWhitelistIds } from './utils';
export class Spreadsheets {
  public readonly postSubscriptionRequest = (email: string) =>
    this.appendRow({
      spreadsheetId: spreadsheetSubscriptionsId,
      range: 'A:A',
      values: [[email]],
    });

  public readonly postWhitelistRequest = (
    type: WhitelistType,
    {
      contacts,
      walletAddress,
      aboutProject = '',
    }: { contacts: string; walletAddress: string; aboutProject?: string },
  ) =>
    this.appendRow({
      spreadsheetId: spreadsheetRequestIds[type],
      range: 'A1:C1',
      values: [[contacts, walletAddress, aboutProject]],
    });

  public readonly postWhitelistLeave = (type: WhitelistType, address: string) =>
    this.appendRow({
      spreadsheetId: spreadsheetWhitelistIds[type],
      range: 'A:A',
      values: [[address]],
    });

  public readonly getWhitelistLeaves = async (type: WhitelistType) => {
    const table = await this.getTable({
      spreadsheetId: spreadsheetWhitelistIds[type],
      range: 'A:A',
    });

    const leaves: Array<string> = table?.map((row) => row[0]).filter((x) => typeof x === 'string') ?? [];

    return leaves;
  };

  private gsapi?: sheets_v4.Sheets;

  private readonly getGsapi = async () => {
    if (!this.gsapi) {
      const client = await new google.auth.JWT(
        ENV.SPREADSHEET_CLIENT_EMAIL,
        undefined,
        ENV.SPREADSHEET_PRIVATE_KEY,
        ['https://www.googleapis.com/auth/spreadsheets'],
      );

      await client.authorize();

      const gsapi = google.sheets({
        version: 'v4',
        auth: client,
      });

      this.gsapi = gsapi;

      return gsapi;
    }

    return this.gsapi;
  };

  private readonly appendRow = async ({
    spreadsheetId,
    range,
    values,
  }: {
    spreadsheetId: string;
    range: string;
    values: Array<Array<string>>;
  }) => {
    const gsapi = await this.getGsapi();

    gsapi.spreadsheets.values.append({
      spreadsheetId,
      range,
      insertDataOption: 'INSERT_ROWS',
      valueInputOption: 'RAW',
      includeValuesInResponse: true,
      requestBody: {
        values,
        majorDimension: 'ROWS',
      },
    });
  };

  private readonly getTable = async ({ spreadsheetId, range }: { spreadsheetId: string; range: string }) => {
    const gsapi = await this.getGsapi();
    const {
      data: { values },
    } = await gsapi.spreadsheets.values.get({
      spreadsheetId,
      range,
      majorDimension: 'ROWS',
    });

    return values;
  };
}
