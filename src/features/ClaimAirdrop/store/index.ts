import { flow, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction } from 'mobx';
import { BigNumber } from 'ethers';

import { BimkonEyes } from 'src/contracts';

import { getAirdropProof } from 'api/controllers/airdrop';

import { autoFetchable } from 'services/AutoFetchable';
import { fetchError, fetchLoading, fetchNothing, fetchSucceed } from 'services/AutoFetchable/utils';

import { SaleState } from 'shared/types/saleStatus';
import { stateToPhase } from 'shared/utils/stateToPhase';
import { TransactionStatus } from 'shared/types/transactionStatus';

export class ClaimAirdrop {
  public claimStatus = fetchNothing<TransactionStatus>();

  public get isSoon() {
    return (
      this.allowedToClaimAutoFetchable.hasValue &&
      this.phaseAutoFetchable.hasValue &&
      this.whitelistedAutoFetchable.hasValue &&
      !!this.whitelisted.value &&
      this.phase.value === 'soon'
    );
  }

  public get isClaimed() {
    return (
      this.allowedToClaimAutoFetchable.hasValue &&
      this.phaseAutoFetchable.hasValue &&
      this.whitelistedAutoFetchable.hasValue &&
      !!this.whitelisted.value &&
      this.allowedToClaim.value === 0
    );
  }

  public get isFinished() {
    return this.phaseAutoFetchable.hasValue && this.phase.value === 'finished' && !this.isClaimed;
  }

  public get isAvailable() {
    return (
      this.allowedToClaimAutoFetchable.hasValue &&
      this.phaseAutoFetchable.hasValue &&
      this.whitelistedAutoFetchable.hasValue &&
      !!this.whitelisted.value &&
      this.phase.value === 'available' &&
      !this.isClaimed
    );
  }

  public get isNotWhitelisted() {
    return (
      this.allowedToClaimAutoFetchable.hasValue &&
      this.phaseAutoFetchable.hasValue &&
      this.whitelistedAutoFetchable.hasValue &&
      !this.whitelisted.value &&
      !this.isFinished
    );
  }

  public get phase() {
    return this.phaseAutoFetchable.data;
  }

  public get whitelisted() {
    return this.whitelistedAutoFetchable.data;
  }

  public get allowedToClaim() {
    return this.allowedToClaimAutoFetchable.data;
  }

  public readonly claim = async () => {
    const address = this.address;
    const bimkonEyes = this.bimkonEyes;

    this.claimStatus = fetchLoading<TransactionStatus>(this.claimStatus.value);

    if (address) {
      try {
        const proof = await getAirdropProof(address);
        const allowedToClaim = await bimkonEyes.allowedToClaimDropAmount(address);
        const transaction = await bimkonEyes.claimAirdrop(proof, allowedToClaim);

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

  constructor(private readonly bimkonEyes: BimkonEyes, private readonly address?: string) {
    makeAutoObservable(this);
    this.runStateChangeListener();
  }

  private readonly phaseAutoFetchable = autoFetchable({
    fetch: () => this.fetchPhase,
  });

  private readonly whitelistedAutoFetchable = autoFetchable({
    fetch: () => this.fetchWhitelisted,
  });

  private readonly allowedToClaimAutoFetchable = autoFetchable({
    fetch: () => this.allowedToClaimSupply,
    deps: () => this.claimStatus.value === 'confirmed',
  });

  private get fetchPhase() {
    const bimkonEyes = this.bimkonEyes;

    return flow(function* () {
      const state = yield bimkonEyes.airDrop();

      if (state === 0 || state === 1 || state === 2) return stateToPhase(state);

      throw new Error('Airdrop state fetch error');
    });
  }

  private get fetchWhitelisted() {
    const bimkonEyes = this.bimkonEyes;
    const address = this.address;

    return flow(function* () {
      if (address) {
        const proof = yield getAirdropProof(address);
        const whitelisted = yield bimkonEyes.canClaimAirDrop(proof, address);

        if (typeof whitelisted === 'boolean') return whitelisted;

        throw new Error('Airdrop whitelisted fetch error');
      }

      return false;
    });
  }

  private get allowedToClaimSupply() {
    const bimkonEyes = this.bimkonEyes;
    const address = this.address;

    return flow(function* () {
      if (address) {
        const bigNumber: BigNumber = yield bimkonEyes.allowedToClaimDropAmount(address);

        return bigNumber.toNumber();
      }

      return null;
    });
  }

  private readonly runStateChangeListener = () => {
    const handleStateChange = (state: SaleState) => this.phaseAutoFetchable.forceUpdate(stateToPhase(state));

    onBecomeObserved(this, 'phase', () => {
      if (this.bimkonEyes.signer) this.bimkonEyes.on('SetAirDropState', handleStateChange);
    });

    onBecomeUnobserved(this, 'phase', () => {
      if (this.bimkonEyes.signer) this.bimkonEyes.off('SetAirDropState', handleStateChange);
    });
  };
}
