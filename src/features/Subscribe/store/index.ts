import { makeAutoObservable, runInAction } from 'mobx';

import { postSubscribe } from 'api/controllers/subscribe';

import { formData } from 'services/FormData';

import { validateEmail } from 'shared/utils/validateEmail';

export class Subscribe {
  public showModal = false;

  public readonly form = formData({
    fields: {
      email: {
        value: '',
        isRequired: true,
        isValid: true,
        validate: validateEmail,
      },
    },
    onSend: (data) => postSubscribe(data.email),
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
