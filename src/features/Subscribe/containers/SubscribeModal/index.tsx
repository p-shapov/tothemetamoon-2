import { FC, FormEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';

import { useSubscribe } from 'features/Subscribe/hooks/useSubscribe';

import { Button } from 'shared/components/Button';
import { Input } from 'shared/components/Input';
import { Modal } from 'shared/components/Modal';

import styles from './SubscribeModal.module.scss';

export const SubscribeModal: FC = observer(() => {
  const {
    toggleModal,
    showModal,
    form: { send, fields, isSent },
  } = useSubscribe();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };

  return (
    <>
      {showModal && (
        <Modal
          title={!isSent ? 'Stay informed!' : 'Email has been sended'}
          description={
            !isSent ? 'Share your contacts to receive our updates.' : "We'll inform you about updates"
          }
          onClose={toggleModal}
        >
          {!isSent && (
            <form className={styles['form']} onSubmit={handleSubmit} noValidate>
              <Input
                label="Email"
                type="email"
                isRequired={fields.email.isRequired}
                isValid={fields.email.isValid}
                onChange={action((email) => {
                  fields.email.value = email;
                })}
              >
                {fields.email.value}
              </Input>

              <div className={styles['send']}>
                <Button type="submit" stretch uppercase>
                  Send
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </>
  );
});
