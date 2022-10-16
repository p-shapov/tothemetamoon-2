import { flow, makeAutoObservable, onBecomeObserved, onBecomeUnobserved } from 'mobx';

import { BimkonEyes } from 'src/contracts';

import { autoFetchable } from 'services/AutoFetchable';

import { SaleState } from 'shared/types/saleStatus';
import { stateToPhase } from 'shared/utils/stateToPhase';

export class PublicMint {
  public get phase() {
    return this.phaseAutoFetchable.data;
  }

  constructor(private readonly bimkonEyes: BimkonEyes, private readonly address?: string) {
    makeAutoObservable(this);
    this.runStateChangeListener();
  }

  private readonly phaseAutoFetchable = autoFetchable({
    fetch: () => this.fetchPhase,
  });

  private readonly runStateChangeListener = () => {
    const handleStateChange = (state: SaleState) => this.phaseAutoFetchable.forceUpdate(stateToPhase(state));

    onBecomeObserved(this, 'phase', () => {
      if (this.bimkonEyes.signer) this.bimkonEyes.on('SetPublicSaleState', handleStateChange);
    });

    onBecomeUnobserved(this, 'phase', () => {
      if (this.bimkonEyes.signer) this.bimkonEyes.off('SetPublicSaleState', handleStateChange);
    });
  };

  private get fetchPhase() {
    const bimkonEyes = this.bimkonEyes;

    return flow(function* () {
      const state = yield bimkonEyes.publicSale();

      if (state === 0 || state === 1 || state === 2) return stateToPhase(state);

      throw new Error('Public sale state fetch error');
    });
  }
}
