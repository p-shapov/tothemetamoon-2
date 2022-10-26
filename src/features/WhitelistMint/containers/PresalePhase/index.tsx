import { observer } from 'mobx-react-lite';

import { useWhitelistMint } from 'features/WhitelistMint/hooks/useWhitelistMint';

import { Phase } from 'shared/components/Phase';

export const PresalePhase = observer(() => {
  const { phase } = useWhitelistMint();

  return <>{phase.value !== null ? <Phase value={phase.value} /> : null}</>;
});
