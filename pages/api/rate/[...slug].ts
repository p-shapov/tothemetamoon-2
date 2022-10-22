import { NextApiRequest, NextApiResponse } from 'next';

import { CoinGecko } from 'services/CoinGecko';

import { getErrorMessage } from 'shared/utils/getErrorMessage';

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

  if (isBadRequest) return res.status(400).send('Bad Request');

  const [coinId, currency] = slug as [string, string];
  const coingecko = new CoinGecko();

  try {
    switch (method) {
      case 'GET': {
        const rate = await coingecko.getRate(coinId, currency);

        return res.status(200).send(rate);
      }
      default: {
        res.setHeader('Allow', ['GET']);

        return res.status(405).send(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    const message = getErrorMessage(error);

    return res.status(500).send(message);
  }
}
