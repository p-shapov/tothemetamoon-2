import { NextApiRequest, NextApiResponse } from 'next';

import { Spreadsheets } from 'services/Spreadsheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const spreadsheets = new Spreadsheets();

  const {
    method,
    body,
    query: { slug },
  } = req;

  const { contacts, walletAddress, aboutProject } = JSON.parse(body);

  const isBadRequest =
    [contacts, walletAddress].some((x) => typeof x !== 'string') ||
    (aboutProject !== undefined && typeof aboutProject !== 'string') ||
    !(slug === 'airdrop' || slug === 'presale');

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
    let message: string;

    if (error instanceof Error) message = error.message;
    else if (typeof error === 'string') message = error;
    else message = 'Unknown error';

    return res.status(500).send(message);
  }
}
