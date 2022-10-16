import { createContext, FC, ReactNode, useMemo } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import { observer } from 'mobx-react-lite';

import { BimkonEyes } from 'src/contracts';
import bimkonEyesABI from 'public/abis/bimkonEyes.json';

import { ShowMintedNFTs } from 'features/ShowMintedNFTs/store';
import { ConnectWalletStore } from 'features/ConnectWallet/store';
import { ClaimAirdrop } from 'features/ClaimAirdrop/store';
import { PublicMint } from 'features/PublicMint/store';
import { WhitelistMint } from 'features/WhitelistMint/store';

import { ENVIRONMENT } from 'shared/constants/environment';

export type StoreContextValue = {
  connectWallet: ConnectWalletStore;
  showMintedNFTs: ShowMintedNFTs;
  claimAirdrop: ClaimAirdrop;
  publicMint: PublicMint;
  whitelistMint: WhitelistMint;
};

export const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: FC<{ children: ReactNode }> = observer(({ children }) => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const bimkonEyes = useContract<BimkonEyes>({
    addressOrName: ENVIRONMENT.BIMKON_EYES_ADDRESS || '',
    contractInterface: bimkonEyesABI,
    signerOrProvider: signer,
  });

  const connectWallet = useMemo(() => new ConnectWalletStore(), []);
  const claimAirdrop = useMemo(() => new ClaimAirdrop(bimkonEyes, address), [address, bimkonEyes]);
  const publicMint = useMemo(() => new PublicMint(bimkonEyes, address), [address, bimkonEyes]);
  const whitelistMint = useMemo(() => new WhitelistMint(bimkonEyes, address), [address, bimkonEyes]);
  const showMintedNFTs = useMemo(
    () => new ShowMintedNFTs(bimkonEyes, () => [claimAirdrop.claimStatus.value]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bimkonEyes],
  );

  return (
    <StoreContext.Provider value={{ connectWallet, showMintedNFTs, claimAirdrop, publicMint, whitelistMint }}>
      {children}
    </StoreContext.Provider>
  );
});
