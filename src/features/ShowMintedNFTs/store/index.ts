import { BigNumber } from 'ethers';
import { flow, makeAutoObservable } from 'mobx';

import { BimkonEyes } from 'contracts/index';

import { autoFetchable } from 'services/AutoFetchable';

export class ShowMintedNFTs {
  public readonly placeholderTokenUri = autoFetchable({
    fetch: () => this.fetchPlaceholderTokenUri,
  });

  public readonly isRevealed = autoFetchable({
    fetch: () => this.fetchIsRevealed,
  });

  public readonly totalSupply = autoFetchable({
    fetch: () => this.fetchTotalSupply,
    deps: this.totalSupplyDeps,
  });

  public readonly maxSupply = autoFetchable({
    fetch: () => this.fetchMaxSupply,
  });

  constructor(
    private readonly getBimkonEyes: () => BimkonEyes,
    private readonly totalSupplyDeps?: () => unknown,
  ) {
    makeAutoObservable(this);
  }

  private get fetchPlaceholderTokenUri() {
    const contract = this.getBimkonEyes();

    return flow(function* () {
      const placeholderTokenUri: string = yield contract.placeholderTokenUri();

      return placeholderTokenUri;
    });
  }

  private get fetchIsRevealed() {
    const contract = this.getBimkonEyes();

    return flow(function* () {
      const isRevealed: boolean = yield contract.isRevealed();

      return isRevealed;
    });
  }

  private get fetchTotalSupply() {
    const contract = this.getBimkonEyes();

    return flow(function* () {
      const bigNumber: BigNumber = yield contract.totalSupply();

      return bigNumber.toNumber();
    });
  }

  private get fetchMaxSupply() {
    const contract = this.getBimkonEyes();

    return flow(function* () {
      const bigNumber: BigNumber = yield contract.MAX_SUPPLY();

      return bigNumber.toNumber();
    });
  }
}
