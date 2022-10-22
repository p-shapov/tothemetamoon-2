import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { useGetWhitelisted } from 'features/GetWhitelisted/hooks/useGetWhitelisted';

import { WhitelistType } from 'services/Spreadsheets/types';

import { Button } from 'shared/components/Button';

import { GetWhitelistedModal } from '../GetWhitelistedModal';

export type GetWhitelistedButtonProps = {
  type: WhitelistType;
  children?: string;
};

export const GetWhitelistedButton: FC<GetWhitelistedButtonProps> = observer(({ type, children }) => {
  const { toggleModal } = useGetWhitelisted();

  return (
    <>
      <Button onClick={toggleModal} uppercase>
        {children || 'Get whitelisted'}
      </Button>

      <GetWhitelistedModal type={type} />
    </>
  );
});
