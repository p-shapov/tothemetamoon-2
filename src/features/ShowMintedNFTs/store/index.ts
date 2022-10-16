import { BigNumber } from 'ethers';
import { flow, makeAutoObservable } from 'mobx';

import { BimkonEyes } from 'src/contracts';

import { autoFetchable } from 'services/AutoFetchable';

export class ShowMintedNFTs {
  public get totalSupply() {
    return this.totalSupplyAutoFetchable.data;
  }

  public get maxSupply() {
    return this.maxSupplyAutoFetchable.data;
  }

  constructor(private readonly bimkonEyes: BimkonEyes, private readonly totalSupplyDeps?: () => unknown) {
    makeAutoObservable(this);
  }

  private readonly totalSupplyAutoFetchable = autoFetchable({
    fetch: () => this.fetchTotalSupply,
    deps: this.totalSupplyDeps,
  });

  private readonly maxSupplyAutoFetchable = autoFetchable({
    fetch: () => this.fetchMaxSupply,
  });

  private get fetchTotalSupply() {
    const contract = this.bimkonEyes;

    return flow(function* () {
      const bigNumber = yield contract.totalSupply();

      if (bigNumber instanceof BigNumber) return bigNumber.toNumber();

      throw new Error('Max supply fetch error');
    });
  }

  private get fetchMaxSupply() {
    const contract = this.bimkonEyes;

    return flow(function* () {
      const bigNumber = yield contract.MAX_SUPPLY();

      if (bigNumber instanceof BigNumber) return bigNumber.toNumber();

      throw new Error('Max supply fetch error');
    });
  }
}
