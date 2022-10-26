import { observer } from 'mobx-react-lite';

import { useClaimAirdrop } from 'features/ClaimAirdrop/hooks/useClaimAirdrop';

import { Phase } from 'shared/components/Phase';
import { ClientOnly } from 'shared/components/ClientOnly';

export const AirdropPhase = observer(() => {
  const { phase } = useClaimAirdrop();

  return <ClientOnly>{phase.value !== null ? <Phase value={phase.value} /> : null}</ClientOnly>;
});
