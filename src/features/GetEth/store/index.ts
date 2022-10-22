import { makeAutoObservable } from 'mobx';

export class GetEthStore {
  public showModal = false;

  public readonly toggleModal = () => {
    this.showModal = !this.showModal;
  };

  constructor() {
    makeAutoObservable(this);
  }
}
