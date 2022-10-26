import { flow, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction } from 'mobx';
import { BigNumber } from 'ethers';

import { getProof } from 'api/controllers/proof';

import { BimkonEyes } from 'contracts/index';

import { autoFetchable } from 'services/AutoFetchable';
import { fetchError, fetchLoading, fetchNothing, fetchSucceed } from 'services/AutoFetchable/utils';

import { SaleState } from 'shared/types/saleStatus';
import { stateToPhase } from 'shared/utils/stateToPhase';
import { TransactionStatus } from 'shared/types/transactionStatus';

const getAirdropProof = getProof.bind(null, 'airdrop');

export class ClaimAirdrop {
  public claimStatus = fetchNothing<TransactionStatus>();

  public readonly phase = autoFetchable({
    fetch: () => this.fetchPhase,
  });

  public readonly whitelisted = autoFetchable({
    fetch: () => this.fetchWhitelisted,
  });

  public readonly allowedAmount = autoFetchable({
    fetch: () => this.fetchAllowedAmount,
    deps: () => this.isConfirmed,
  });

  public readonly maxSupply = autoFetchable({
    fetch: () => this.fetchMaxSupply,
  });

  public get isPending() {
    return this.claimStatus.value === 'pending';
  }

  public get isConfirmed() {
    return this.claimStatus.value === 'confirmed';
  }

  public get isWhitelisted() {
    const { value: whitelisted, isFetched } = this.whitelisted;

    return isFetched && !!whitelisted;
  }

  public get isNotWhitelisted() {
    const { value: whitelisted, isFetched } = this.whitelisted;

    return isFetched && !whitelisted && !this.isFinished;
  }

  public get isSoon() {
    const { value: phase, isFetched } = this.phase;

    return isFetched && phase === 'soon' && this.isWhitelisted;
  }

  public get isMinted() {
    const { value: allowedAmount, isFetched: allowedAmountIsFetched } = this.allowedAmount;
    const { value: phase, isFetched: phaseIsFetched } = this.phase;

    return (
      allowedAmountIsFetched &&
      phaseIsFetched &&
      allowedAmount === 0 &&
      phase === 'available' &&
      this.isWhitelisted
    );
  }

  public get isAvailable() {
    const { value: phase, isFetched } = this.phase;

    return isFetched && phase === 'available' && this.isWhitelisted && !this.isMinted;
  }

  public get isFinished() {
    const { value: phase, isFetched } = this.phase;

    return isFetched && phase === 'finished';
  }

  public readonly mint = async () => {
    const address = this.getAddress();
    const bimkonEyes = this.getBimkonEyes();

    this.claimStatus = fetchLoading<TransactionStatus>(this.claimStatus.value);

    if (address) {
      try {
        const proof = await getAirdropProof(address);
        const maxAirdropMint = await bimkonEyes.MAX_AIRDROP_MINT();
        const transaction = await bimkonEyes.claimAirdrop(proof, maxAirdropMint);

        runInAction(() => {
          this.claimStatus = fetchSucceed('pending');
        });

        await transaction.wait();

        runInAction(() => {
          this.claimStatus = fetchSucceed('confirmed');
        });
      } catch (error) {
        runInAction(() => {
          this.claimStatus = fetchError<TransactionStatus>(error, this.claimStatus.value);
        });
      }
    }
  };

  constructor(
    private readonly getBimkonEyes: () => BimkonEyes,
    private readonly getAddress: () => string | undefined,
  ) {
    makeAutoObservable(this);
    this.runStateChangeListener();
  }

  private get fetchPhase() {
    const bimkonEyes = this.getBimkonEyes();

    return flow(function* () {
      const state: SaleState = yield bimkonEyes.airDrop();

      return stateToPhase(state);
    });
  }

  private get fetchMaxSupply() {
    const bimkonEyes = this.getBimkonEyes();

    return flow(function* () {
      const bigNumber: BigNumber = yield bimkonEyes.MAX_AIRDROP_MINT();

      return bigNumber.toNumber();
    });
  }

  private get fetchAllowedAmount() {
    const bimkonEyes = this.getBimkonEyes();
    const address = this.getAddress();

    return flow(function* () {
      if (address) {
        const bigNumber: BigNumber = yield bimkonEyes.allowedToClaimDropAmount(address);

        return bigNumber.toNumber();
      }

      return null;
    });
  }

  private get fetchWhitelisted() {
    const bimkonEyes = this.getBimkonEyes();
    const address = this.getAddress();

    return flow(function* () {
      if (address) {
        const proof: Array<string> = yield getAirdropProof(address);
        const whitelisted: boolean = yield bimkonEyes.canClaimAirDrop(proof, address);

        return whitelisted;
      }

      return null;
    });
  }

  private readonly runStateChangeListener = () => {
    const bimkonEyes = this.getBimkonEyes();

    const handleStateChange = (state: SaleState) => this.phase.forceUpdate(stateToPhase(state));

    onBecomeObserved(this, 'phase', () => {
      if (bimkonEyes.signer) bimkonEyes.on('SetAirDropState', handleStateChange);
    });

    onBecomeUnobserved(this, 'phase', () => {
      if (bimkonEyes.signer) bimkonEyes.off('SetAirDropState', handleStateChange);
    });
  };
}
