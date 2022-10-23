import { FC } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import { useConnectWallet } from 'features/ConnectWallet/hooks/useConnectWallet';

import { Button } from 'shared/components/Button';
import { trim } from 'shared/utils/trim';
import { useSsr } from 'shared/hooks/useSsr';
import { PopupMenu } from 'shared/components/PopupMenu';

import { ConnectModal } from '../ConnectModal';

export const ConnectButton: FC = () => {
  const isSsr = useSsr();
  const { address, isDisconnected, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setModal } = useConnectWallet();

  const handleClick = () => {
    if (isDisconnected) setModal('wallets');
  };

  return (
    <>
      <PopupMenu
        isDisabled={isDisconnected}
        items={[
          { text: 'Observe my NFT', to: '/' },
          { text: 'Disconnect', onClick: disconnect },
        ]}
      >
        <Button
          onClick={handleClick}
          uppercase={!isSsr && !isConnected}
          isLoading={isConnected}
          isDisabled={isConnected}
        >
          {address && !isSsr ? trim(address, 4, 6) : 'Connect wallet'}
        </Button>
      </PopupMenu>

      <ConnectModal />
    </>
  );
};
