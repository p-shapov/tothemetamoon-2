import { BaseLayout } from 'layouts/BaseLayout';
import { MintingLayout } from 'layouts/MintingLayout';

import { Page } from 'shared/types/page';

export const Airdrop: Page = () => null;

Airdrop.getLayout = (page) => (
  <BaseLayout>
    <MintingLayout id="airdrop">{page}</MintingLayout>
  </BaseLayout>
);
