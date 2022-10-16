import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { usePublicMint } from 'features/PublicMint/hooks/usePublicMint';

import { CounterWithMax } from 'shared/components/Counter';

export const SaleNFTsCounter: FC = observer(() => {
  const { allowedToMint, amountToMint, setAmountToMint } = usePublicMint();

  return (
    <>
      {allowedToMint.value !== null && (
        <CounterWithMax min={1} max={allowedToMint.value} onChange={setAmountToMint}>
          {amountToMint}
        </CounterWithMax>
      )}
    </>
  );
});
