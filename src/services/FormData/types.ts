export type FormDataStatus = 'idle' | 'loading' | 'sent' | 'error';

export type FormDataField = {
  value: string;
  isValid?: boolean;
  isRequired?: boolean;
  validate?: (value: string) => boolean;
};
