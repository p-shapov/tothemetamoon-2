import { action, makeAutoObservable, onBecomeObserved, reaction, runInAction } from 'mobx';

import { getErrorMessage } from 'shared/utils/getErrorMessage';
import { objectEntries } from 'shared/utils/objectEntries';

import { FormDataField, FormDataStatus } from './types';

export const formData = <T extends Record<string, string>>({
  fields,
  onSend,
}: {
  fields: Record<keyof T, FormDataField>;
  onSend: (data: T) => Promise<unknown>;
}) => new FormData(fields, onSend);

export class FormData<T extends Record<string, string>> {
  public status: FormDataStatus = 'idle';

  public error: string | null = null;

  public get isSent() {
    return this.status === 'sent';
  }

  public get isLoading() {
    return this.status === 'loading';
  }

  public get isIdle() {
    return this.status === 'idle';
  }

  public get isError() {
    return this.status === 'error';
  }

  private get isValid() {
    this.entries.forEach(
      action(([, item]) => {
        if (item.validate) item.isValid = item.validate(item.value);
        else if (item.isRequired) item.isValid = item.value.length > 0;
        else item.isValid = true;
      }),
    );

    const isValid = this.entries.reduce((acc, [, { isValid }]) => (!isValid ? !!isValid : acc), true);

    return isValid;
  }

  public readonly send = async () => {
    if (this.isValid) {
      this.status = 'loading';

      try {
        await this.onSend(this.sendData);

        runInAction(() => {
          this.status = 'sent';
        });
      } catch (error) {
        runInAction(() => {
          this.status = 'error';
          this.error = getErrorMessage(error);
        });
      }
    }
  };

  constructor(
    public readonly fields: Record<keyof T, FormDataField>,
    private readonly onSend: (data: T) => Promise<unknown>,
  ) {
    makeAutoObservable(this);

    onBecomeObserved(this, 'fields', () => {
      reaction(
        () => Object.values(this.sendData),
        () =>
          this.entries.forEach(
            action(([, item]) => {
              item.isValid = true;
            }),
          ),
        { fireImmediately: true },
      );
    });
  }

  private get sendData() {
    const sendData = this.entries.reduce((acc, [key, { value }]) => ({ ...acc, [key]: value }), {} as T);

    return sendData;
  }

  private get entries() {
    return objectEntries(this.fields);
  }
}
