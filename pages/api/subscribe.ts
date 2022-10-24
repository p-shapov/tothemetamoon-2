import { NextApiRequest, NextApiResponse } from 'next';

import { Spreadsheets } from 'services/Spreadsheets';

import { getErrorMessage } from 'shared/utils/getErrorMessage';

const spreadsheets = new Spreadsheets();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body: email } = req;

  const isBadRequest = email === undefined;

  if (isBadRequest) {
    res.status(400).send('Bad Request');

    return;
  }

  try {
    switch (method) {
      case 'POST': {
        await spreadsheets.postSubscriptionRequest(email);

        res.status(200).end();

        break;
      }
      default: {
        res.setHeader('Allow', ['POST']);

        res.status(405).send(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    const message = getErrorMessage(error);

    res.status(500).send(message);
  }
}
