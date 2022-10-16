import { makeAutoObservable, runInAction } from 'mobx';

import { PostRequestBody } from 'api/controllers/request/type';
import { postRequest } from 'api/controllers/request';

import { WhitelistType } from 'services/Spreadsheets/types';

export class GetWhitelisted {
  public showModal = false;

  public errors: Partial<Record<WhitelistType, string>> = {};

  public sended: Record<WhitelistType, boolean> = {
    airdrop: false,
    presale: false,
  };

  public data: Record<WhitelistType, PostRequestBody> = {
    airdrop: {
      contacts: '',
      walletAddress: '',
    },
    presale: {
      contacts: '',
      walletAddress: '',
    },
  };

  public readonly sendData = async (type: WhitelistType) => {
    if (this.data[type].walletAddress.length > 0 && this.data[type].contacts.length > 0) {
      try {
        await postRequest(type, this.data[type]);

        runInAction(() => {
          this.data[type] = {
            contacts: '',
            walletAddress: '',
          };
          this.sended[type] = true;
        });
      } catch (error) {
        if (error instanceof Error) this.errors[type] = error.message;
        else if (typeof error === 'string') this.errors[type] = error;
        else this.errors[type] = 'Unknown error';
      }
    }
  };

  public readonly setData = (type: WhitelistType, data: Partial<PostRequestBody>) => {
    runInAction(() => {
      this.data[type] = { ...this.data[type], ...data };
    });
  };

  public readonly toggleModal = () => {
    runInAction(() => {
      this.showModal = !this.showModal;
    });
  };

  constructor() {
    makeAutoObservable(this);
  }
}
