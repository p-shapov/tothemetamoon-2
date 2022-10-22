import { BigNumber } from 'ethers';
import { flow, makeAutoObservable } from 'mobx';

import { BimkonEyes } from 'contracts/index';

import { autoFetchable } from 'services/AutoFetchable';

export class ShowMintedNFTs {
  public get isRevealed() {
    return this.isRevealedAutoFetchable.data;
  }

  public get totalSupply() {
    return this.totalSupplyAutoFetchable.data;
  }

  public get maxSupply() {
    return this.maxSupplyAutoFetchable.data;
  }

  constructor(private readonly bimkonEyes: BimkonEyes, private readonly totalSupplyDeps?: () => unknown) {
    makeAutoObservable(this);
  }

  private readonly isRevealedAutoFetchable = autoFetchable({
    fetch: () => this.fetchIsRevealed,
  });

  private readonly totalSupplyAutoFetchable = autoFetchable({
    fetch: () => this.fetchTotalSupply,
    deps: this.totalSupplyDeps,
  });

  private readonly maxSupplyAutoFetchable = autoFetchable({
    fetch: () => this.fetchMaxSupply,
  });

  private get fetchIsRevealed() {
    const contract = this.bimkonEyes;

    return flow(function* () {
      const isRevealed: boolean = yield contract.isRevealed();

      return isRevealed;
    });
  }

  private get fetchTotalSupply() {
    const contract = this.bimkonEyes;

    return flow(function* () {
      const bigNumber: BigNumber = yield contract.totalSupply();

      return bigNumber.toNumber();
    });
  }

  private get fetchMaxSupply() {
    const contract = this.bimkonEyes;

    return flow(function* () {
      const bigNumber: BigNumber = yield contract.MAX_SUPPLY();

      return bigNumber.toNumber();
    });
  }
}
