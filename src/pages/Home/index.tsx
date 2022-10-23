import cn from 'classnames';
import { useAccount } from 'wagmi';

import { BaseLayout } from 'layouts/BaseLayout';

import { ConnectButton } from 'features/ConnectWallet/containers/ConnectButton';
import { GetWhitelistedButton } from 'features/GetWhitelisted/containers/GetWhitelistedButton';

import { Button } from 'shared/components/Button';
import { Image } from 'shared/components/Image';
import { useSsr } from 'shared/hooks/useSsr';
import { ico_flame } from 'shared/icons/flame';
import { ico_metalamp } from 'shared/icons/metalamp';
import { ico_toTheMoon } from 'shared/icons/toTheMoon';
import { Page } from 'shared/types/page';

import styles from './Home.module.scss';

export const Home: Page = () => {
  const { isConnected } = useAccount();
  const isSsr = useSsr();

  const isConnectedAndNotSsr = isConnected && !isSsr;

  return (
    <div className={styles['root']}>
      <div className={styles['layout']}>
        <h1 className={styles['title']}>
          <span>
            To the
            <br /> M
          </span>
          <span className={styles['logo']}>{ico_metalamp}</span>
          <span>taMoon</span>
        </h1>

        <p className={styles['description']}>
          From the creators of the first
          <br />
          Cardano NFT-marketplace
        </p>

        <div className={styles['buttons']}>
          {isConnectedAndNotSsr ? (
            <Button to={'/airdrop'} uppercase>
              Start minting
            </Button>
          ) : (
            <ConnectButton />
          )}
          <GetWhitelistedButton type="airdrop">Get airdrop whitelisted</GetWhitelistedButton>
        </div>
      </div>

      {isConnectedAndNotSsr && <div className={styles['to-the-moon']}>{ico_toTheMoon}</div>}

      <div className={styles['orbit']}>
        <div className={styles['planet']} />

        <div
          className={cn(
            styles['spaceship'],
            styles[`spaceship--${isConnectedAndNotSsr ? 'to-the-moon' : 'floating'}`],
          )}
        >
          <Image alt="spaceship" src="images/spaceship.png" width={277} height={277} />
          {isConnectedAndNotSsr && <div className={styles['rocket-flame']}>{ico_flame}</div>}
        </div>
      </div>
    </div>
  );
};

Home.getLayout = (page) => <BaseLayout gradient="diagonal">{page}</BaseLayout>;

export default Home;
