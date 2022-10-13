import { ReactElement } from 'react';

import { ModalName } from '../../Provider/types';
import { ConnectModal } from '../ConnectModal';
import { WalletModal } from '../WalletModal';

export const connectModalsMap: Record<ModalName, ReactElement> = {
  connect: <ConnectModal />,
  metamask: <WalletModal id="metamask" />,
  coinbase: <WalletModal id="coinbase" />,
  walletConnect: <WalletModal id="walletConnect" />,
};
