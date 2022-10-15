import { flow, makeAutoObservable, onBecomeObserved, onBecomeUnobserved } from 'mobx';

import { BimkonEyes } from 'src/contracts';

import { autoFetchable } from 'services/AutoFetchable';

export class ClaimAirdrop {
  public get state() {
    return this.stateAutoFetchable.data;
  }

  constructor(private readonly bimkonEyes: BimkonEyes, private readonly address?: string) {
    makeAutoObservable(this);
    this.runStateChangeListener();
  }

  private readonly stateAutoFetchable = autoFetchable({
    fetch: () => this.fetchState,
  });

  private readonly runStateChangeListener = () => {
    const handleStateChange = (value: 0 | 1 | 2) => this.stateAutoFetchable.forceUpdate(value);

    onBecomeObserved(this, 'state', () => {
      if (this.bimkonEyes.signer) this.bimkonEyes.on('SetAirDropState', handleStateChange);
    });

    onBecomeUnobserved(this, 'state', () => {
      if (this.bimkonEyes.signer) this.bimkonEyes.off('SetAirDropState', handleStateChange);
    });
  };

  private get fetchState() {
    const bimkonEyes = this.bimkonEyes;

    return flow(function* () {
      const state = yield bimkonEyes.airDrop();

      if (state === 0 || state === 1 || state === 2) return state as 0 | 1 | 2;

      throw new Error('Airdrop state fetch error');
    });
  }
}
