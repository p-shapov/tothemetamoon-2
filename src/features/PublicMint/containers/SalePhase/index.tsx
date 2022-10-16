import { observer } from 'mobx-react-lite';

import { usePublicMint } from 'features/PublicMint/hooks/usePublicMint';

import { Phase } from 'shared/components/Phase';

export const SalePhase = observer(() => {
  const { phase } = usePublicMint();

  return phase.value !== null ? <Phase value={phase.value} /> : null;
});
