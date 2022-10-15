import { observer } from 'mobx-react-lite';

import { usePublicMint } from 'features/PublicMint/hooks/usePublicMint';

import { Status } from 'shared/components/Status';

export const SaleStatus = observer(() => {
  const { state } = usePublicMint();

  return state.value !== null ? <Status state={state.value} /> : null;
});
