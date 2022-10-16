import { createContext, FC, ReactNode, useMemo } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import { observer } from 'mobx-react-lite';

import { BimkonEyes, SignatureChecker } from 'src/contracts';
import bimkonEyesABI from 'public/abis/bimkonEyes.json';
import signatureCheckerABI from 'public/abis/signatureChecker.json';

import { ShowMintedNFTs } from 'features/ShowMintedNFTs/store';
import { ConnectWalletStore } from 'features/ConnectWallet/store';
import { ClaimAirdrop } from 'features/ClaimAirdrop/store';
import { PublicMint } from 'features/PublicMint/store';
import { WhitelistMint } from 'features/WhitelistMint/store';
import { GetWhitelisted } from 'features/GetWhitelisted/store';

import { ENVIRONMENT } from 'shared/constants/environment';

export type StoreContextValue = {
  connectWallet: ConnectWalletStore;
  showMintedNFTs: ShowMintedNFTs;
  claimAirdrop: ClaimAirdrop;
  publicMint: PublicMint;
  whitelistMint: WhitelistMint;
  getWhitelisted: GetWhitelisted;
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
  const signatureChecker = useContract<SignatureChecker>({
    addressOrName: ENVIRONMENT.SIGNATURE_CHECKER_ADDRESS || '',
    contractInterface: signatureCheckerABI,
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

  return (
    <StoreContext.Provider
      value={{ connectWallet, showMintedNFTs, claimAirdrop, publicMint, whitelistMint, getWhitelisted }}
    >
      {children}
    </StoreContext.Provider>
  );
});
