import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useWhitelistMint } from 'features/WhitelistMint/hooks/useWhitelistMint';

import { CounterWithMax } from 'shared/components/Counter';

export const PresaleNFTsCounter: FC = observer(() => {
  const { allowedToMint, amountToMint, setAmountToMint } = useWhitelistMint();

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
