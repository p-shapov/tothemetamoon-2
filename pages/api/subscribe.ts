import { NextApiRequest, NextApiResponse } from 'next';

import { Spreadsheets } from 'services/Spreadsheets';

import { getErrorMessage } from 'shared/utils/getErrorMessage';

const spreadsheets = new Spreadsheets();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body: email } = req;

  const isBadRequest = email === undefined;

  if (isBadRequest) return res.status(400).send('Bad Request');

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
    const message = getErrorMessage(error);

    return res.status(500).send(message);
  }
}
