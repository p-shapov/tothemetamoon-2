import { makeAutoObservable, runInAction } from 'mobx';

import { postRequest } from 'api/controllers/request';

import { formData } from 'services/FormData';

export class GetWhitelisted {
  public showModal = false;

  public readonly presaleForm = formData({
    fields: {
      contacts: {
        value: '',
        isRequired: true,
      },
      walletAddress: {
        value: '',
        isRequired: true,
      },
      aboutProject: {
        value: '',
      },
    },
    onSend: postRequest.bind(null, 'presale'),
  });

  public readonly airdropForm = formData({
    fields: {
      contacts: {
        value: '',
        isRequired: true,
      },
      walletAddress: {
        value: '',
        isRequired: true,
      },
      aboutProject: {
        value: '',
      },
    },
    onSend: postRequest.bind(null, 'airdrop'),
  });

  public readonly toggleModal = () => {
    runInAction(() => {
      this.showModal = !this.showModal;
    });
  };

  constructor() {
    makeAutoObservable(this);
  }
}
