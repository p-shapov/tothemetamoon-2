import { BaseLayout } from 'layouts/BaseLayout';
import { MintingLayout } from 'layouts/MintingLayout';

import { Page } from 'shared/types/page';

export const Presale: Page = () => null;

Presale.getLayout = (page) => (
  <BaseLayout>
    <MintingLayout id="presale">{page}</MintingLayout>
  </BaseLayout>
);
