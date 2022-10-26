import { createContext, FC, ReactNode, useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import { BimkonEyes } from 'contracts/index';

import { ShowMintedNFTs } from 'features/ShowMintedNFTs/store';
import { ConnectWalletStore } from 'features/ConnectWallet/store';
import { ClaimAirdrop } from 'features/ClaimAirdrop/store';
import { PublicMint } from 'features/PublicMint/store';
import { WhitelistMint } from 'features/WhitelistMint/store';
import { GetWhitelisted } from 'features/GetWhitelisted/store';
import { Subscribe } from 'features/Subscribe/store';
import { GetEthStore } from 'features/GetEth/store';

import { ENV } from 'shared/constants/env';
import { ABI } from 'shared/constants/abi';
import { useObservableContract } from 'shared/hooks/useObservableContract';
import { useObservableAddress } from 'shared/hooks/useObservableAddress';

export type StoreContextValue = {
  connectWallet: ConnectWalletStore;
  showMintedNFTs: ShowMintedNFTs;
  claimAirdrop: ClaimAirdrop;
  publicMint: PublicMint;
  whitelistMint: WhitelistMint;
  getWhitelisted: GetWhitelisted;
  subscribe: Subscribe;
  getEth: GetEthStore;
};

export const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: FC<{ children: ReactNode }> = observer(({ children }) => {
  const observableBimkonEyes = useObservableContract<BimkonEyes>({
    addressOrName: ENV.BIMKON_EYES_ADDRESS,
    contractInterface: ABI.BIMKON_EYES,
  });
  const observableAddress = useObservableAddress();

  const connectWallet = useMemo(() => new ConnectWalletStore(), []);
  const claimAirdrop = useMemo(
    () =>
      new ClaimAirdrop(
        () => observableBimkonEyes.value,
        () => observableAddress.value,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const publicMint = useMemo(
    () =>
      new PublicMint(
        () => observableBimkonEyes.value,
        () => observableAddress.value,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const whitelistMint = useMemo(
    () =>
      new WhitelistMint(
        () => observableBimkonEyes.value,
        () => observableAddress.value,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const showMintedNFTs = useMemo(
    () =>
      new ShowMintedNFTs(
        () => observableBimkonEyes.value,
        () => [
          claimAirdrop.claimStatus.value === 'confirmed',
          whitelistMint.mintStatus.value === 'confirmed',
          publicMint.mintStatus.value === 'confirmed',
        ],
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const getWhitelisted = useMemo(() => new GetWhitelisted(), []);
  const subscribe = useMemo(() => new Subscribe(), []);
  const getEth = useMemo(() => new GetEthStore(), []);

  return (
    <StoreContext.Provider
      value={{
        connectWallet,
        showMintedNFTs,
        claimAirdrop,
        publicMint,
        whitelistMint,
        getWhitelisted,
        subscribe,
        getEth,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
});
