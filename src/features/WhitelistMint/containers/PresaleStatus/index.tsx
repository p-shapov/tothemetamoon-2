import { observer } from 'mobx-react-lite';

import { useWhitelistMint } from 'features/WhitelistMint/hooks/useWhitelistMint';

import { Status } from 'shared/components/Status';

export const PresaleStatus = observer(() => {
  const { state } = useWhitelistMint();

  return state.value !== null ? <Status state={state.value} /> : null;
});
