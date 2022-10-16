import { flow, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction } from 'mobx';
import { BigNumber } from 'ethers';

import { BimkonEyes } from 'src/contracts';

import { getAirdropProof } from 'api/controllers/airdrop';

import { autoFetchable } from 'services/AutoFetchable';
import { fetchError, fetchLoading, fetchNothing, fetchSucceed } from 'services/AutoFetchable/utils';

import { SaleState } from 'shared/types/saleStatus';
import { stateToPhase } from 'shared/utils/stateToPhase';

export class ClaimAirdrop {
  public claimStatus = fetchNothing<'pending' | 'confirmed'>();

  public get isSoon() {
    const phase = this.phase.value;
    const whitelisted = this.whitelisted.value;

    return whitelisted && phase === 'soon';
  }

  public get isClaimed() {
    const totalSupply = this.totalSupply.value;
    const maxSupply = this.maxSupply.value;
    const whitelisted = this.whitelisted.value;

    return whitelisted && totalSupply === maxSupply;
  }

  public get isFinished() {
    const phase = this.phase.value;

    return phase === 'finished' && !this.isClaimed;
  }

  public get isAvailable() {
    const phase = this.phase.value;
    const whitelisted = this.whitelisted.value;

    return whitelisted && phase === 'available' && !this.isClaimed;
  }

  public get isNotWhitelisted() {
    const whitelisted = this.whitelisted.value;

    return whitelisted !== null && !whitelisted && !this.isFinished;
  }

  public get phase() {
    return this.phaseAutoFetchable.data;
  }

  public get whitelisted() {
    return this.whitelistedAutoFetchable.data;
  }

  public get totalSupply() {
    return this.totalSupplyAutoFetchable.data;
  }

  public get maxSupply() {
    return this.maxSupplyAutoFetchable.data;
  }

  public readonly claim = async () => {
    const address = this.address;
    const bimkonEyes = this.bimkonEyes;

    this.claimStatus = fetchLoading(this.claimStatus.value);

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
          this.claimStatus = fetchError(error, this.claimStatus.value);
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

  private readonly totalSupplyAutoFetchable = autoFetchable({
    fetch: () => this.fetchTotalSupply,
    deps: () => this.claimStatus.value === 'confirmed',
  });

  private readonly maxSupplyAutoFetchable = autoFetchable({
    fetch: () => this.fetchMaxSupply,
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

      return null;
    });
  }

  private get fetchTotalSupply() {
    const bimkonEyes = this.bimkonEyes;
    const address = this.address;

    return flow(function* () {
      if (address) {
        const bigNumber: BigNumber = yield bimkonEyes.totalAirdropMint(address);

        return bigNumber.toNumber();
      }

      return null;
    });
  }

  private get fetchMaxSupply() {
    const bimkonEyes = this.bimkonEyes;
    const address = this.address;

    return flow(function* () {
      if (address) {
        const bigNumber: BigNumber = yield bimkonEyes.MAX_AIRDROP_MINT();

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
