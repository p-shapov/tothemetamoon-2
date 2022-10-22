import { FC } from 'react';

import { useGetEth } from 'features/GetEth/hooks/useGetEth';

import { Button } from 'shared/components/Button';

import { GetEthModal } from '../GetEthModal';

export const GetEthButton: FC = () => {
  const { toggleModal } = useGetEth();

  return (
    <>
      <Button uppercase onClick={toggleModal}>
        Get eth
      </Button>

      <GetEthModal />
    </>
  );
};
