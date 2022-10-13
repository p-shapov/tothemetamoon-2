import { FC } from 'react';

import { Button } from 'shared/components/Button';
import { trim } from 'shared/utils/trim';

import { useConnectWallet } from '../../hooks/useConnectWallet';

export type ConnectButtonProps = {
  showAddress?: boolean;
};

export const ConnectButton: FC<ConnectButtonProps> = ({ showAddress = false }) => {
  const {
    store: { setModal },
    wagmi: { address, disconnect },
  } = useConnectWallet();

  const handleClick = () => {
    if (address) disconnect();
    else setModal('connect');
  };

  return (
    <Button onClick={handleClick}>
      {address ? (showAddress ? trim(address, 4, 6) : 'Disconnect') : 'Connect'}
    </Button>
  );
};
