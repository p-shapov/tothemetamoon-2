import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';
import { NextApiRequest, NextApiResponse } from 'next';

import { Spreadsheets } from 'services/Spreadsheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    query: { slug },
  } = req;

  const isBadRequest = slug !== 'airdrop' && slug !== 'presale';

  if (isBadRequest) return res.status(400).send('Bad Request');

  const spreadsheets = new Spreadsheets();

  try {
    switch (method) {
      case 'GET': {
        const leaves = await spreadsheets.getWhitelistLeaves(slug);
        const tree = new MerkleTree(leaves, keccak256, { hashLeaves: true, sortPairs: true });
        const root = tree.getHexRoot();

        return res.status(200).send(root);
      }
      default: {
        res.setHeader('Allow', ['GET']);

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
