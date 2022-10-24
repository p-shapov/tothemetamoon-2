import { NextApiRequest, NextApiResponse } from 'next';

import { CoinGecko } from 'services/CoinGecko';

import { getErrorMessage } from 'shared/utils/getErrorMessage';

const coingecko = new CoinGecko();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    query: { slug },
  } = req;

  const isBadRequest =
    slug === undefined ||
    typeof slug === 'string' ||
    slug[0] === undefined ||
    slug[0] === undefined ||
    slug[1] === undefined ||
    slug[1] === undefined;

  if (isBadRequest) {
    res.status(400).send('Bad Request');

    return;
  }

  const [coinId, currency] = slug as [string, string];

  try {
    switch (method) {
      case 'GET': {
        const rate = await coingecko.getRate(coinId, currency);

        res.status(200).send(rate);

        break;
      }
      default: {
        res.setHeader('Allow', ['GET']);

        res.status(405).send(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    const message = getErrorMessage(error);

    res.status(500).send(message);
  }
}
