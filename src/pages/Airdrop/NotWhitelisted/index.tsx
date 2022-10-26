import { FC } from 'react';

import { GetWhitelistedButton } from 'features/GetWhitelisted/containers/GetWhitelistedButton';

import { TextSection } from 'shared/components/TextSection';

export const NotWhitelisted: FC = () => {
  return (
    <>
      <TextSection title="You’re not whitelisted yet :(">
        To participate in AirDrop please send us an information about your project
      </TextSection>

      <GetWhitelistedButton type="airdrop" />
    </>
  );
};
