import { ReactElement, FC } from 'react';
import { QRCode as QRCodeLogo } from 'react-qrcode-logo';

import palette from 'shared/styles/palette.module.scss';

import styles from './Qrcode.module.scss';

export type QrcodeProps = {
  value?: string;
  logo?: ReactElement;
};

export const Qrcode: FC<QrcodeProps> = ({ value, logo }) => (
  <div className={styles['root']}>
    <div className={styles['layout']}>
      <QRCodeLogo
        value={value}
        size={500}
        fgColor={palette['fg-secondary']}
        qrStyle="dots"
        ecLevel="H"
        logoImage="/"
        eyeRadius={5}
        bgColor={palette['bg-secondary']}
        removeQrCodeBehindLogo
      />
      {logo && <div className={styles['logo']}>{logo}</div>}
    </div>
  </div>
);
