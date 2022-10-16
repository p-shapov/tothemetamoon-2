import { flow, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction } from 'mobx';
import { BigNumber } from 'ethers';

import { BimkonEyes } from 'src/contracts';

import { getPresaleProof } from 'api/controllers/presale';
import { getEthRateInUsd } from 'api/controllers/eth';

import { autoFetchable } from 'services/AutoFetchable';
import { fetchError, fetchLoading, fetchNothing, fetchSucceed } from 'services/AutoFetchable/utils';
import { Pair } from 'services/Pair';

import { SaleState } from 'shared/types/saleStatus';
import { stateToPhase } from 'shared/utils/stateToPhase';
import { formatToEth } from 'shared/utils/formatToEth';

export class WhitelistMint {
  public mintStatus = fetchNothing<'pending' | 'confirmed'>();

  public amountToMint = 1;

  public get isSoon() {
    const phase = this.phase.value;
    const whitelisted = this.whitelisted.value;

    return whitelisted && phase === 'soon';
  }

  public get isAllMinted() {
    const totalSupply = this.totalSupply.value;
    const maxSupply = this.maxSupply.value;
    const whitelisted = this.whitelisted.value;

    return whitelisted && totalSupply === maxSupply;
  }

  public get isFinished() {
    const phase = this.phase.value;

    return phase === 'finished' && !this.isAllMinted;
  }

  public get isAvailable() {
    const phase = this.phase.value;
    const whitelisted = this.whitelisted.value;

    return whitelisted && phase === 'available' && !this.isAllMinted;
  }

  public get isNotWhitelisted() {
    const whitelisted = this.whitelisted.value;

    return whitelisted !== null && !whitelisted && !this.isFinished;
  }

  public get price() {
    return this.priceAutoFetchable.data;
  }

  public get totalCost() {
    const price = this.price.value;

    return price && price.mul(this.amountToMint);
  }

  public get phase() {
    return this.phaseAutoFetchable.data;
  }

  public get whitelisted() {
    return this.whitelistedAutoFetchable.data;
  }

  public get allowedToMint() {
    return this.allowedToMintAutoFetchable.data;
  }

  public get totalSupply() {
    return this.totalSupplyAutoFetchable.data;
  }

  public get maxSupply() {
    return this.maxSupplyAutoFetchable.data;
  }

  public readonly setAmountToMint = (x: number) => {
    if (x >= 1 && x <= (this.allowedToMint.value || 1)) {
      runInAction(() => {
        this.amountToMint = x;
      });
    }
  };

  public readonly mint = async () => {
    const address = this.address;
    const bimkonEyes = this.bimkonEyes;

    this.mintStatus = fetchLoading(this.mintStatus.value);

    if (address) {
      try {
        const proof = await getPresaleProof(address);
        const price = await bimkonEyes.whiteListSalePrice();
        const transaction = await bimkonEyes.whitelistMint(proof, this.amountToMint, {
          value: price.mul(this.amountToMint),
        });

        runInAction(() => {
          this.mintStatus = fetchSucceed('pending');
        });

        await transaction.wait();

        this.setAmountToMint(1);

        runInAction(() => {
          this.mintStatus = fetchSucceed('confirmed');
        });
      } catch (error) {
        runInAction(() => {
          this.mintStatus = fetchError(error, this.mintStatus.value);
        });
      }
    }
  };

  constructor(private readonly bimkonEyes: BimkonEyes, private readonly address?: string) {
    makeAutoObservable(this);
    this.runStateChangeListener();
  }

  private readonly priceAutoFetchable = autoFetchable({
    fetch: () => this.fetchPrice,
  });

  private readonly phaseAutoFetchable = autoFetchable({
    fetch: () => this.fetchPhase,
  });

  private readonly whitelistedAutoFetchable = autoFetchable({
    fetch: () => this.fetchWhitelisted,
  });

  private readonly allowedToMintAutoFetchable = autoFetchable({
    fetch: () => this.fetchAllowedToMint,
    deps: () => this.mintStatus.value === 'confirmed',
  });

  private readonly totalSupplyAutoFetchable = autoFetchable({
    fetch: () => this.fetchTotalSupply,
    deps: () => this.mintStatus.value === 'confirmed',
  });

  private readonly maxSupplyAutoFetchable = autoFetchable({
    fetch: () => this.fetchMaxSupply,
  });

  private get fetchPrice() {
    const bimkonEyes = this.bimkonEyes;

    return flow(function* () {
      const bigNumber = yield bimkonEyes.whiteListSalePrice();

      if (bigNumber instanceof BigNumber) {
        const eth = formatToEth(bigNumber);
        const rate = yield getEthRateInUsd();

        return new Pair(eth, rate);
      }

      throw new Error('Presale state fetch error');
    });
  }

  private get fetchPhase() {
    const bimkonEyes = this.bimkonEyes;

    return flow(function* () {
      const state = yield bimkonEyes.whiteListSale();

      if (state === 0 || state === 1 || state === 2) return stateToPhase(state);

      throw new Error('Presale state fetch error');
    });
  }

  private get fetchWhitelisted() {
    const bimkonEyes = this.bimkonEyes;
    const address = this.address;

    return flow(function* () {
      if (address) {
        const proof = yield getPresaleProof(address);
        const whitelisted = yield bimkonEyes.isWhiteListed(proof, address);

        if (typeof whitelisted === 'boolean') return whitelisted;

        throw new Error('Presale whitelisted fetch error');
      }

      return null;
    });
  }

  private get fetchTotalSupply() {
    const bimkonEyes = this.bimkonEyes;
    const address = this.address;

    return flow(function* () {
      if (address) {
        const bigNumber: BigNumber = yield bimkonEyes.totalWhitelistMint(address);

        return bigNumber.toNumber();
      }

      return null;
    });
  }

  private get fetchAllowedToMint() {
    const bimkonEyes = this.bimkonEyes;
    const address = this.address;

    return flow(function* () {
      if (address) {
        const bigNumber: BigNumber = yield bimkonEyes.allowedToWhiteListMintAmount(address);

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
        const bigNumber: BigNumber = yield bimkonEyes.MAX_WHITELIST_MINT();

        return bigNumber.toNumber();
      }

      return null;
    });
  }

  private readonly runStateChangeListener = () => {
    const handleStateChange = (state: SaleState) => this.phaseAutoFetchable.forceUpdate(stateToPhase(state));

    onBecomeObserved(this, 'phase', () => {
      if (this.bimkonEyes.signer) this.bimkonEyes.on('SetWhiteListSaleState', handleStateChange);
    });

    onBecomeUnobserved(this, 'phase', () => {
      if (this.bimkonEyes.signer) this.bimkonEyes.off('SetWhiteListSaleState', handleStateChange);
    });
  };
}
