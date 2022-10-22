import { createContext, FC, ReactNode, useMemo } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import { observer } from 'mobx-react-lite';

import { BimkonEyes, SignatureChecker } from 'contracts/index';

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
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const bimkonEyes = useContract<BimkonEyes>({
    addressOrName: ENV.BIMKON_EYES_ADDRESS,
    contractInterface: ABI.BIMKON_EYES,
    signerOrProvider: signer,
  });
  const signatureChecker = useContract<SignatureChecker>({
    addressOrName: ENV.SIGNATURE_CHECKER_ADDRESS,
    contractInterface: ABI.SIGNATURE_CHECKER,
    signerOrProvider: signer,
  });

  const connectWallet = useMemo(() => new ConnectWalletStore(), []);
  const claimAirdrop = useMemo(() => new ClaimAirdrop(bimkonEyes, address), [address, bimkonEyes]);
  const publicMint = useMemo(
    () => new PublicMint(bimkonEyes, signatureChecker, address),
    [address, bimkonEyes, signatureChecker],
  );
  const whitelistMint = useMemo(() => new WhitelistMint(bimkonEyes, address), [address, bimkonEyes]);
  const showMintedNFTs = useMemo(
    () =>
      new ShowMintedNFTs(bimkonEyes, () => [
        claimAirdrop.claimStatus.value === 'confirmed',
        whitelistMint.mintStatus.value === 'confirmed',
        publicMint.mintStatus.value === 'confirmed',
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bimkonEyes],
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
