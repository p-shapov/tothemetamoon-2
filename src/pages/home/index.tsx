import { BaseLayout } from 'layouts/BaseLayout';

import { Page } from 'shared/types/page';

export const Home: Page = () => {
  return null;
};

Home.getLayout = (page) => <BaseLayout gradient="diagonal">{page}</BaseLayout>;

export default Home;
