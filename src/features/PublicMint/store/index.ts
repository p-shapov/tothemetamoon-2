import { flow, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction } from 'mobx';
import { BigNumber } from 'ethers';
import { arrayify } from 'ethers/lib/utils';

import { getEthRateInUsd } from 'api/controllers/eth';

import { BimkonEyes, SignatureChecker } from 'contracts/index';

import { autoFetchable } from 'services/AutoFetchable';
import { fetchError, fetchLoading, fetchNothing, fetchSucceed } from 'services/AutoFetchable/utils';
import { pair } from 'services/Pair';

import { SaleState } from 'shared/types/saleStatus';
import { stateToPhase } from 'shared/utils/stateToPhase';
import { formatToEth } from 'shared/utils/formatToEth';
import { TransactionStatus } from 'shared/types/transactionStatus';

export class PublicMint {
  public mintStatus = fetchNothing<TransactionStatus>();

  public amountToMint = 1;

  public get isFetched() {
    return this.allowedToMintAutoFetchable.isFetched && this.phaseAutoFetchable.isFetched;
  }

  public get isSoon() {
    return this.phase.value === 'soon';
  }

  public get isAllMinted() {
    return this.phase.value === 'available' && this.allowedToMint.value === 0;
  }

  public get isFinished() {
    return this.phase.value === 'finished' && !this.isAllMinted;
  }

  public get isAvailable() {
    return this.phase.value === 'available' && !this.isAllMinted;
  }

  public get price() {
    return this.priceAutoFetchable.data;
  }

  public get totalCost() {
    return this.price.value && this.price.value.mul(this.amountToMint);
  }

  public get phase() {
    return this.phaseAutoFetchable.data;
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
    const signatureChecker = this.signatureChecker;

    this.mintStatus = fetchLoading<TransactionStatus>(this.mintStatus.value);

    if (address) {
      try {
        const price = await bimkonEyes.publicSalePrice();
        const cat = await signatureChecker.CAT();
        const signature = await bimkonEyes.signer.signMessage(arrayify(cat));

        const transaction = await bimkonEyes.mint(this.amountToMint, signature, {
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

  constructor(
    private readonly bimkonEyes: BimkonEyes,
    private readonly signatureChecker: SignatureChecker,
    private readonly address?: string,
  ) {
    makeAutoObservable(this);
    this.runStateChangeListener();
  }

  private readonly priceAutoFetchable = autoFetchable({
    fetch: () => this.fetchPrice,
  });

  private readonly phaseAutoFetchable = autoFetchable({
    fetch: () => this.fetchPhase,
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
      const bigNumber: BigNumber = yield bimkonEyes.publicSalePrice();
      const eth = formatToEth(bigNumber);
      const rate: number = yield getEthRateInUsd();

      return pair({ eth, rate });
    });
  }

  private get fetchPhase() {
    const bimkonEyes = this.bimkonEyes;

    return flow(function* () {
      const state: SaleState = yield bimkonEyes.publicSale();

      return stateToPhase(state);
    });
  }

  private get fetchTotalSupply() {
    const bimkonEyes = this.bimkonEyes;
    const address = this.address;

    return flow(function* () {
      if (address) {
        const bigNumber: BigNumber = yield bimkonEyes.totalPublicMint(address);

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
        const bigNumber: BigNumber = yield bimkonEyes.allowedToPublicMintAmount(address);

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
        const bigNumber: BigNumber = yield bimkonEyes.MAX_PUBLIC_MINT();

        return bigNumber.toNumber();
      }

      return null;
    });
  }

  private readonly runStateChangeListener = () => {
    const handleStateChange = (state: SaleState) => this.phaseAutoFetchable.forceUpdate(stateToPhase(state));

    onBecomeObserved(this, 'phase', () => {
      if (this.bimkonEyes.signer) this.bimkonEyes.on('SetPublicSaleState', handleStateChange);
    });

    onBecomeUnobserved(this, 'phase', () => {
      if (this.bimkonEyes.signer) this.bimkonEyes.off('SetPublicSaleState', handleStateChange);
    });
  };
}
