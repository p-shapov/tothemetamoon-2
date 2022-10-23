import { flow, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction } from 'mobx';
import { BigNumber } from 'ethers';

import { getProof } from 'api/controllers/proof';
import { getEthRateInUsd } from 'api/controllers/eth';

import { BimkonEyes } from 'contracts/index';

import { autoFetchable } from 'services/AutoFetchable';
import { fetchError, fetchLoading, fetchNothing, fetchSucceed } from 'services/AutoFetchable/utils';
import { pair } from 'services/Pair';

import { SaleState } from 'shared/types/saleStatus';
import { stateToPhase } from 'shared/utils/stateToPhase';
import { formatToEth } from 'shared/utils/formatToEth';
import { TransactionStatus } from 'shared/types/transactionStatus';

const getPresaleProof = getProof.bind(null, 'presale');

export class WhitelistMint {
  public mintStatus = fetchNothing<TransactionStatus>();

  public amountToMint = 1;

  public get isFetched() {
    return (
      this.phaseAutoFetchable.isFetched &&
      this.allowedToMintAutoFetchable.isFetched &&
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

  public get isAllMinted() {
    return this.isWhitelisted && this.phase.value === 'available' && this.allowedToMint.value === 0;
  }

  public get isFinished() {
    return this.phase.value === 'finished' && !this.isAllMinted;
  }

  public get isAvailable() {
    return this.isWhitelisted && this.phase.value === 'available' && !this.isAllMinted;
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

    this.mintStatus = fetchLoading<TransactionStatus>(this.mintStatus.value);

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
          this.mintStatus = fetchError<TransactionStatus>(error, this.mintStatus.value);
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
      const bigNumber: BigNumber = yield bimkonEyes.whiteListSalePrice();
      const eth = formatToEth(bigNumber);
      const rate: number = yield getEthRateInUsd();

      return pair({ eth, rate });
    });
  }

  private get fetchPhase() {
    const bimkonEyes = this.bimkonEyes;

    return flow(function* () {
      const state: SaleState = yield bimkonEyes.whiteListSale();

      return stateToPhase(state);
    });
  }

  private get fetchWhitelisted() {
    const bimkonEyes = this.bimkonEyes;
    const address = this.address;

    return flow(function* () {
      if (address) {
        const proof: Array<string> = yield getPresaleProof(address);
        const whitelisted: boolean = yield bimkonEyes.isWhiteListed(proof, address);

        return whitelisted;
      }

      return false;
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
