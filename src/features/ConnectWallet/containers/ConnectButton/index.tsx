import { FC } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import { useConnectWallet } from 'features/ConnectWallet/hooks/useConnectWallet';

import { Button } from 'shared/components/Button';
import { trim } from 'shared/utils/trim';
import { useSsr } from 'shared/hooks/useSsr';
import { PopupMenu } from 'shared/components/PopupMenu';

import { ConnectModal } from '../ConnectModal';

export type ConnectButtonProps = {
  showAddress?: boolean;
};

export const ConnectButton: FC<ConnectButtonProps> = ({ showAddress = false }) => {
  const isSsr = useSsr();
  const { address, isDisconnected, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setModal } = useConnectWallet();

  const handleClick = () => {
    if (address) disconnect();
    else setModal('wallets');
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
        <Button onClick={handleClick} uppercase={!isSsr && !(showAddress && isConnected)}>
          {address && !isSsr ? (showAddress ? trim(address, 4, 6) : 'Disconnect') : 'Connect wallet'}
        </Button>
      </PopupMenu>

      <ConnectModal />
    </>
  );
};
