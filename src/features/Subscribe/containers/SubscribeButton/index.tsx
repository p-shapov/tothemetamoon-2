import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useSubscribe } from 'features/Subscribe/hooks/useSubscribe';

import { Button } from 'shared/components/Button';

import { SubscribeModal } from '../SubscribeModal';

export const SubscribeButton: FC = observer(() => {
  const { toggleModal } = useSubscribe();

  return (
    <>
      <Button onClick={toggleModal} uppercase>
        Subscribe
      </Button>

      <SubscribeModal />
    </>
  );
});
