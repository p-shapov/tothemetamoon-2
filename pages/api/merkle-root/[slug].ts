import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';
import { NextApiRequest, NextApiResponse } from 'next';

import { Spreadsheets } from 'services/Spreadsheets';

import { getErrorMessage } from 'shared/utils/getErrorMessage';

const spreadsheets = new Spreadsheets();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    query: { slug },
  } = req;

  const isBadRequest = slug !== 'airdrop' && slug !== 'presale';

  if (isBadRequest) {
    res.status(400).send('Bad Request');

    return;
  }

  try {
    switch (method) {
      case 'GET': {
        const leaves = await spreadsheets.getWhitelistLeaves(slug);
        const tree = new MerkleTree(leaves, keccak256, { hashLeaves: true, sortPairs: true });
        const root = tree.getHexRoot();

        res.status(200).send(root);

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
