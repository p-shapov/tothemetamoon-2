import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useWhitelistMint } from 'features/WhitelistMint/hooks/useWhitelistMint';

import { CounterWithMax } from 'shared/components/Counter';
import { ClientOnly } from 'shared/components/ClientOnly';

export const PresaleNFTsCounter: FC = observer(() => {
  const { allowedAmount, amount, setAmount } = useWhitelistMint();

  return (
    <ClientOnly>
      {allowedAmount.value !== null && (
        <CounterWithMax min={1} max={allowedAmount.value} onChange={setAmount}>
          {amount}
        </CounterWithMax>
      )}
    </ClientOnly>
  );
});
