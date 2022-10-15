import { observer } from 'mobx-react-lite';

import { useClaimAirdrop } from 'features/ClaimAirdrop/hooks/useClaimAirdrop';

import { Status } from 'shared/components/Status';

export const AirdropStatus = observer(() => {
  const { state } = useClaimAirdrop();

  return state.value !== null ? <Status state={state.value} /> : null;
});
