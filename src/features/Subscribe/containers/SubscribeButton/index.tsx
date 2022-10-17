import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useSubscribe } from 'features/Subscribe/hooks/useSubscribe';

import { Button } from 'shared/components/Button';
import { Input } from 'shared/components/Input';
import { Modal } from 'shared/components/Modal';

import styles from './SubscribeButton.module.scss';

export const SubscribeButton: FC = observer(() => {
  const { toggleModal, showModal, sended, send, setEmail, email } = useSubscribe();

  return (
    <>
      <Button onClick={toggleModal} uppercase>
        Subscribe
      </Button>

      {showModal && (
        <Modal
          title={!sended ? 'Stay informed!' : 'Email has been sended'}
          description={
            !sended ? 'Share your contacts to receive our updates.' : "We'll inform you about updates"
          }
          onClose={toggleModal}
        >
          {!sended && (
            <form className={styles['form']} onSubmit={(e) => e.preventDefault()}>
              <Input label="Email" onChange={setEmail}>
                {email}
              </Input>

              <div className={styles['send']}>
                <Button type="submit" onClick={send} stretch uppercase>
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
