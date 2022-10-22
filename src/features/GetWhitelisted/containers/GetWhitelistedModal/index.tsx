import { action } from 'mobx';
import { FC, FormEvent } from 'react';
import { observer } from 'mobx-react-lite';

import { useGetWhitelisted } from 'features/GetWhitelisted/hooks/useGetWhitelisted';

import { WhitelistType } from 'services/Spreadsheets/types';

import { Button } from 'shared/components/Button';
import { Input } from 'shared/components/Input';
import { Modal } from 'shared/components/Modal';

import styles from './GetWhitelistedModal.module.scss';

export type GetWhitelistedModalProps = {
  type: WhitelistType;
};

export const GetWhitelistedModal: FC<GetWhitelistedModalProps> = observer(({ type }) => {
  const { showModal, toggleModal, airdropForm, presaleForm } = useGetWhitelisted();

  const forms: Record<WhitelistType, typeof airdropForm & typeof presaleForm> = {
    airdrop: airdropForm,
    presale: presaleForm,
  };

  const { fields, send, isSent } = forms[type];

  const title: Record<WhitelistType, string> = {
    airdrop: 'AirDrop',
    presale: 'Private Presale',
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };
  return (
    <>
      {showModal && (
        <Modal
          title={!isSent ? `To get whitelisted for an ${title[type]}` : 'Thanks for participating'}
          description={
            !isSent ? 'send us an information about your project you want us to participate in' : undefined
          }
          onClose={toggleModal}
        >
          {!isSent ? (
            <form className={styles['form']} onSubmit={handleSubmit} noValidate>
              <Input
                label="Contacts"
                isRequired
                isValid={fields.contacts.isValid}
                onChange={action((contacts) => {
                  fields.contacts.value = contacts;
                })}
              >
                {fields.contacts.value}
              </Input>
              <Input
                label="Wallet address"
                isRequired
                isValid={fields.walletAddress.isValid}
                onChange={action((walletAddress) => {
                  fields.walletAddress.value = walletAddress;
                })}
              >
                {fields.walletAddress.value}
              </Input>
              <Input
                type="text-area"
                label="Project info"
                isValid={fields.aboutProject.isValid}
                onChange={action((aboutProject) => {
                  fields.aboutProject.value = aboutProject;
                })}
              >
                {fields.aboutProject.value}
              </Input>

              <div className={styles['send']}>
                <Button type="submit" stretch uppercase>
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
