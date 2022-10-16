import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { useGetWhitelisted } from 'features/GetWhitelisted/hooks/useGetWhitelisted';

import { WhitelistType } from 'services/Spreadsheets/types';

import { Modal } from 'shared/components/Modal';
import { Input } from 'shared/components/Input';
import { Button } from 'shared/components/Button';

import styles from './GetWhitelistedButton.module.scss';

export type GetWhitelistedButtonProps = {
  type: WhitelistType;
  children?: string;
};

export const GetWhitelistedButton: FC<GetWhitelistedButtonProps> = observer(({ type, children }) => {
  const { showModal, toggleModal, data, setData, sendData, sended } = useGetWhitelisted();

  const { contacts, walletAddress, aboutProject } = data[type];

  const title: Record<WhitelistType, string> = {
    airdrop: 'AirDrop',
    presale: 'Private Presale',
  };

  return (
    <>
      <Button onClick={toggleModal} uppercase>
        {children || 'Get whitelisted'}
      </Button>

      {showModal && (
        <Modal
          title={!sended[type] ? `To get whitelisted for an ${title[type]}` : 'Thanks for participating'}
          description={
            !sended[type]
              ? 'send us an information about your project you want us to participate in'
              : undefined
          }
          onClose={toggleModal}
        >
          {!sended[type] ? (
            <form className={styles['form']} onSubmit={(e) => e.preventDefault()}>
              <Input label="Contacts" isRequired onChange={(contacts) => setData(type, { contacts })}>
                {contacts}
              </Input>
              <Input
                label="Wallet address"
                isRequired
                onChange={(walletAddress) => setData(type, { walletAddress })}
              >
                {walletAddress}
              </Input>
              <Input
                type="text-area"
                label="Project info"
                onChange={(aboutProject) => setData(type, { aboutProject })}
              >
                {aboutProject || ''}
              </Input>

              <div className={styles['send']}>
                <Button type="submit" stretch onClick={sendData.bind(null, type)}>
                  Send
                </Button>
              </div>
            </form>
          ) : (
            <div className={styles['sended']}>
              <span>Our manager will contact you to discuss the details.</span>
              <span>You will be whitelisted within 2 working days.</span>
              <span>
                To get more information about airdrop, presale and public sale please check our roadmap.
              </span>
            </div>
          )}
        </Modal>
      )}
    </>
  );
});
