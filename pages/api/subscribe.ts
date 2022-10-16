import { NextApiRequest, NextApiResponse } from 'next';

import { Spreadsheets } from 'services/Spreadsheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body: email } = req;

  const isBadRequest = typeof email !== 'string';

  if (isBadRequest) return res.status(400).send('Bad Request');

  const spreadsheets = new Spreadsheets();

  try {
    switch (method) {
      case 'POST': {
        await spreadsheets.postSubscriptionRequest(email);

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
