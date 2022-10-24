import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';
import { NextApiRequest, NextApiResponse } from 'next';

import { Spreadsheets } from 'services/Spreadsheets';
import { WhitelistType } from 'services/Spreadsheets/types';

import { getErrorMessage } from 'shared/utils/getErrorMessage';

const spreadsheets = new Spreadsheets();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    query: { slug },
  } = req;

  const isBadRequest =
    typeof slug === 'string' ||
    slug === undefined ||
    !(slug[0] === 'airdrop' || slug[0] === 'presale') ||
    slug[1] === undefined;

  if (isBadRequest) {
    res.status(400).send('Bad Request');

    return;
  }

  const [type, address] = slug as [WhitelistType, string];

  try {
    switch (method) {
      case 'GET': {
        const leaves = await spreadsheets.getWhitelistLeaves(type);

        const tree = new MerkleTree(leaves, keccak256, { hashLeaves: true, sortPairs: true });
        const proof = tree.getHexProof(keccak256(address));

        res.status(200).json(proof);

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
