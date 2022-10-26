import { flow, makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction } from 'mobx';
import { BigNumber } from 'ethers';
import { arrayify } from 'ethers/lib/utils';

import { getEthRateInUsd } from 'api/controllers/eth';

import { BimkonEyes } from 'contracts/index';

import { autoFetchable } from 'services/AutoFetchable';
import { fetchError, fetchLoading, fetchNothing, fetchSucceed } from 'services/AutoFetchable/utils';
import { pair } from 'services/Pair';

import { SaleState } from 'shared/types/saleStatus';
import { stateToPhase } from 'shared/utils/stateToPhase';
import { formatToEth } from 'shared/utils/formatToEth';
import { TransactionStatus } from 'shared/types/transactionStatus';

export class PublicMint {
  public mintStatus = fetchNothing<TransactionStatus>();

  public amount = 1;

  public readonly price = autoFetchable({
    fetch: () => this.fetchPrice,
  });

  public readonly phase = autoFetchable({
    fetch: () => this.fetchPhase,
  });

  public readonly allowedAmount = autoFetchable({
    fetch: () => this.fetchAllowedAmount,
    deps: () => this.isConfirmed,
  });

  public readonly totalSupply = autoFetchable({
    fetch: () => this.fetchTotalSupply,
    deps: () => this.isConfirmed,
  });

  public readonly maxSupply = autoFetchable({
    fetch: () => this.fetchMaxSupply,
  });

  public get totalCost() {
    return this.price.value && this.price.value.mul(this.amount);
  }

  public get isPending() {
    return this.mintStatus.value === 'pending';
  }

  public get isConfirmed() {
    return this.mintStatus.value === 'confirmed';
  }

  public get isSoon() {
    const { value: phase, isFetched } = this.phase;

    return isFetched && phase === 'soon';
  }

  public get isMinted() {
    const { value: phase, isFetched: phaseIsFetched } = this.phase;
    const { value: allowedAmount, isFetched: allowedAmountIsFetched } = this.allowedAmount;

    return phaseIsFetched && allowedAmountIsFetched && phase === 'available' && allowedAmount === 0;
  }

  public get isAvailable() {
    const { value: phase, isFetched } = this.phase;

    return isFetched && phase === 'available' && !this.isMinted;
  }

  public get isFinished() {
    const { value: phase, isFetched } = this.phase;

    return isFetched && phase === 'finished';
  }

  public readonly setAmount = (x: number) => {
    if (x >= 1 && x <= (this.allowedAmount.value || 1)) {
      runInAction(() => {
        this.amount = x;
      });
    }
  };

  public readonly mint = async () => {
    const address = this.getAddress();
    const bimkonEyes = this.getBimkonEyes();

    this.mintStatus = fetchLoading<TransactionStatus>(this.mintStatus.value);

    if (address) {
      try {
        const price = await bimkonEyes.publicSalePrice();
        const cat = await bimkonEyes.CAT();
        const signature = await bimkonEyes.signer.signMessage(arrayify(cat));

        const transaction = await bimkonEyes.mint(this.amount, signature, {
          value: price.mul(this.amount),
        });

        runInAction(() => {
          this.mintStatus = fetchSucceed('pending');
        });

        await transaction.wait();

        this.setAmount(1);

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
    private readonly getBimkonEyes: () => BimkonEyes,
    private readonly getAddress: () => string | undefined,
  ) {
    makeAutoObservable(this);
    this.runStateChangeListener();
  }

  private get fetchPrice() {
    const bimkonEyes = this.getBimkonEyes();

    return flow(function* () {
      const bigNumber: BigNumber = yield bimkonEyes.publicSalePrice();
      const eth = formatToEth(bigNumber);
      const rate: number = yield getEthRateInUsd();

      return pair({ eth, rate });
    });
  }

  private get fetchPhase() {
    const bimkonEyes = this.getBimkonEyes();

    return flow(function* () {
      const state: SaleState = yield bimkonEyes.publicSale();

      return stateToPhase(state);
    });
  }

  private get fetchTotalSupply() {
    const bimkonEyes = this.getBimkonEyes();
    const address = this.getAddress();

    return flow(function* () {
      if (address) {
        const bigNumber: BigNumber = yield bimkonEyes.totalPublicMint(address);

        return bigNumber.toNumber();
      }

      return null;
    });
  }

  private get fetchAllowedAmount() {
    const bimkonEyes = this.getBimkonEyes();
    const address = this.getAddress();

    return flow(function* () {
      if (address) {
        const bigNumber: BigNumber = yield bimkonEyes.allowedToPublicMintAmount(address);

        return bigNumber.toNumber();
      }

      return null;
    });
  }

  private get fetchMaxSupply() {
    const bimkonEyes = this.getBimkonEyes();
    const address = this.getAddress();

    return flow(function* () {
      if (address) {
        const bigNumber: BigNumber = yield bimkonEyes.MAX_PUBLIC_MINT();

        return bigNumber.toNumber();
      }

      return null;
    });
  }

  private readonly runStateChangeListener = () => {
    const bimkonEyes = this.getBimkonEyes();

    const handleStateChange = (state: SaleState) => this.phase.forceUpdate(stateToPhase(state));

    onBecomeObserved(this, 'phase', () => {
      if (bimkonEyes.signer) bimkonEyes.on('SetPublicSaleState', handleStateChange);
    });

    onBecomeUnobserved(this, 'phase', () => {
      if (bimkonEyes.signer) bimkonEyes.off('SetPublicSaleState', handleStateChange);
    });
  };
}
