import { flow, makeAutoObservable, onBecomeObserved, onBecomeUnobserved } from 'mobx';
import { BigNumber } from 'ethers';

import { BimkonEyes } from 'src/contracts';

import { getAirdropProof } from 'api/controllers/airdrop';

import { autoFetchable } from 'services/AutoFetchable';
import { fetchNothing } from 'services/AutoFetchable/utils';

import { SaleState } from 'shared/types/saleStatus';
import { stateToPhase } from 'shared/utils/stateToPhase';

export class ClaimAirdrop {
  public claimStatus = fetchNothing<'pending' | 'confirmed'>();

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

  public readonly claim = () => {
    // TODO :: claim method implementation
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
