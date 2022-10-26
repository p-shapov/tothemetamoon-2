import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { usePublicMint } from 'features/PublicMint/hooks/usePublicMint';

import { CounterWithMax } from 'shared/components/Counter';
import { ClientOnly } from 'shared/components/ClientOnly';

export const SaleNFTsCounter: FC = observer(() => {
  const { allowedAmount, amount, setAmount } = usePublicMint();

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
