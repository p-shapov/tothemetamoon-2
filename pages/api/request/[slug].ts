import { NextApiRequest, NextApiResponse } from 'next';

import { Spreadsheets } from 'services/Spreadsheets';

import { getErrorMessage } from 'shared/utils/getErrorMessage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const spreadsheets = new Spreadsheets();

  const {
    method,
    body,
    query: { slug },
  } = req;

  const { contacts, walletAddress, aboutProject = '' } = JSON.parse(body);

  const isBadRequest =
    [contacts, walletAddress].some((x) => x === undefined) || !(slug === 'airdrop' || slug === 'presale');

  if (isBadRequest) return res.status(400).send('Bad Request');

  try {
    switch (method) {
      case 'POST': {
        await spreadsheets.postWhitelistRequest(slug, { contacts, walletAddress, aboutProject });

        return res.status(200).end();
      }
      default: {
        res.setHeader('Allow', ['POST']);

        return res.status(405).send(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    const message = getErrorMessage(error);

    return res.status(500).send(message);
  }
}
