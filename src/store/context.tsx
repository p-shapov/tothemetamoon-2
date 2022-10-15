import { createContext, FC, ReactNode, useMemo } from 'react';
import { useContract, useSigner } from 'wagmi';

import { BimkonEyes } from 'src/contracts';
import bimkonEyesABI from 'public/abis/bimkonEyes.json';

import { ShowMintedNFTs } from 'features/ShowMintedNFTs/store';
import { ConnectWalletStore } from 'features/ConnectWallet/store';

import { ENVIRONMENT } from 'shared/constants/environment';

export type StoreContextValue = {
  connectWallet: ConnectWalletStore;
  showMintedNFTs: ShowMintedNFTs;
};

export const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: signerOrProvider } = useSigner();

  const bimkonEyes = useContract<BimkonEyes>({
    addressOrName: ENVIRONMENT.BIMKON_EYES_ADDRESS || '',
    contractInterface: bimkonEyesABI,
    signerOrProvider,
  });

  const connectWallet = useMemo(() => new ConnectWalletStore(), []);
  const showMintedNFTs = useMemo(() => new ShowMintedNFTs(bimkonEyes), [bimkonEyes]);

  return <StoreContext.Provider value={{ connectWallet, showMintedNFTs }}>{children}</StoreContext.Provider>;
};
