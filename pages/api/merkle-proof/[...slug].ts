import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';
import { NextApiRequest, NextApiResponse } from 'next';

import { Spreadsheets } from 'services/Spreadsheets';
import { WhitelistType } from 'services/Spreadsheets/types';

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

  if (isBadRequest) return res.status(400).send('Bad Request');

  const [type, address] = slug as [WhitelistType, string];

  const spreadsheets = new Spreadsheets();

  try {
    switch (method) {
      case 'GET': {
        const leaves = await spreadsheets.getWhitelistLeaves(type);

        const tree = new MerkleTree(leaves, keccak256, { hashLeaves: true, sortPairs: true });
        const proof = tree.getHexProof(keccak256(address));

        return res.status(200).json(proof);
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
