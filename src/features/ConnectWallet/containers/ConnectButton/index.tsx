import { FC } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import { useConnectWallet } from 'features/ConnectWallet/hooks/useConnectWallet';

import { Button } from 'shared/components/Button';
import { trim } from 'shared/utils/trim';
import { PopupMenu } from 'shared/components/PopupMenu';
import { ClientOnly } from 'shared/components/ClientOnly';

import { ConnectModal } from '../ConnectModal';

export const ConnectButton: FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setModal } = useConnectWallet();

  const handleClick = () => {
    if (!isConnected) setModal('wallets');
  };

  return (
    <ClientOnly>
      <PopupMenu
        isDisabled={!isConnected}
        items={[
          { text: 'Observe my NFT', to: '/' },
          { text: 'Disconnect', onClick: disconnect },
        ]}
      >
        <Button
          onClick={handleClick}
          uppercase={!isConnected}
          isLoading={isConnected}
          isDisabled={isConnected}
        >
          {address ? trim(address, 4, 6) : 'Connect wallet'}
        </Button>
      </PopupMenu>

      <ConnectModal />
    </ClientOnly>
  );
};
