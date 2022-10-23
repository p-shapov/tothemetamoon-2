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

  public get isFetched() {
    return (
      this.allowedToClaimAutoFetchable.isFetched &&
      this.phaseAutoFetchable.isFetched &&
      this.whitelistedAutoFetchable.isFetched
    );
  }

  public get isWhitelisted() {
    return !!this.whitelisted.value;
  }

  public get isNotWhitelisted() {
    return !this.isWhitelisted && !this.isFinished;
  }

  public get isSoon() {
    return this.isWhitelisted && this.phase.value === 'soon';
  }

  public get isClaimed() {
    return this.isWhitelisted && this.allowedToClaim.value === 0;
  }

  public get isFinished() {
    return this.phase.value === 'finished' && !this.isClaimed;
  }

  public get isAvailable() {
    return this.isWhitelisted && this.phase.value === 'available' && !this.isClaimed;
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
      const state: SaleState = yield bimkonEyes.airDrop();

      return stateToPhase(state);
    });
  }

  private get fetchWhitelisted() {
    const bimkonEyes = this.bimkonEyes;
    const address = this.address;

    return flow(function* () {
      if (address) {
        const proof: Array<string> = yield getAirdropProof(address);
        const whitelisted: boolean = yield bimkonEyes.canClaimAirDrop(proof, address);

        return whitelisted;
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
