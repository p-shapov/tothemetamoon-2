import { FC } from 'react';

import { Modal, ModalProps } from 'shared/components/Modal';

import { useConnectWallet } from '../../hooks/useConnectWallet';

export type ModalWithClose = Omit<ModalProps, 'onClose'>;

export const ModalWithClose: FC<ModalWithClose> = ({ title, children }) => {
  const {
    store: { setModal },
  } = useConnectWallet();

  return (
    <Modal title={title} onClose={setModal.bind(null, null)}>
      {children}
    </Modal>
  );
};
