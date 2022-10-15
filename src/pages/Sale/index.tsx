import { BaseLayout } from 'layouts/BaseLayout';
import { MintingLayout } from 'layouts/MintingLayout';

import { Page } from 'shared/types/page';

export const Sale: Page = () => null;

Sale.getLayout = (page) => (
  <BaseLayout>
    <MintingLayout id="sale">{page}</MintingLayout>
  </BaseLayout>
);
