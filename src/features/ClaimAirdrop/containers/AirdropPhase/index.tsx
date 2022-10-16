import { observer } from 'mobx-react-lite';

import { useClaimAirdrop } from 'features/ClaimAirdrop/hooks/useClaimAirdrop';

import { Phase } from 'shared/components/Phase';

export const AirdropPhase = observer(() => {
  const { phase } = useClaimAirdrop();

  return phase.value !== null ? <Phase value={phase.value} /> : null;
});
