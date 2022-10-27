import { FC } from 'react';

import { ConnectorId } from 'services/WagmiClient/types';

import { Switch } from 'shared/components/Switch';
import { ErrorWithCode } from 'shared/types/errorWithCode';

export type TipProps = {
  id: ConnectorId;
  error: ErrorWithCode | null;
  fallback?: string;
};

export const Tip: FC<TipProps> = ({ id, fallback, error }) => {
  // TODO :: make mapping for error messages
  const isMetamaskNotAuthorized = id === 'metamask' && error?.code === -32002;
  const isError = !!error;

  return (
    <Switch
      value={true}
      fallback={fallback}
      cases={[
        {
          guard: isMetamaskNotAuthorized,
          el: 'Authorize account via MetaMask extension.',
        },
        { guard: isError, el: error?.message },
      ]}
    />
  );
};
