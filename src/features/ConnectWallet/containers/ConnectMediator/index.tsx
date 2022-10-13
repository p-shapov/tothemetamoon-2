import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useConnectWallet } from '../../hooks/useConnectWallet';
import { connectModalsMap } from './data';

export const ConnectMediator: FC = observer(() => {
  const {
    store: { modal },
  } = useConnectWallet();

  return modal && connectModalsMap[modal];
});
