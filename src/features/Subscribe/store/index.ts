import { makeAutoObservable, runInAction } from 'mobx';

import { postSubscribe } from 'api/controllers/subscribe';

import { validateEmail } from 'shared/utils/validateEmail';

export class Subscribe {
  public showModal = false;

  public email = '';

  public error?: string;

  public sended = false;

  public readonly send = async () => {
    if (validateEmail(this.email)) {
      try {
        await postSubscribe(this.email);

        runInAction(() => {
          this.email = '';
          this.sended = true;
        });
      } catch (error) {
        if (error instanceof Error) this.error = error.message;
        else if (typeof error === 'string') this.error = error;
        else this.error = 'Unknown error';
      }
    }
  };

  public readonly setEmail = (email: string) => {
    runInAction(() => {
      this.email = email;
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
