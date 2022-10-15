import { ReactElement } from 'react';

import { Path } from 'services/Router/types';

import { Link } from 'shared/components/Link';

import styles from './Tabs.module.scss';

export type TabsProps<T extends string> = {
  active: T;
  items: Array<{
    id: T;
    to?: Path;
    text: string;
    badge?: ReactElement;
  }>;
  onChange?(id: T): void;
};

export const Tabs = <T extends string>({
  active,
  items,
  onChange = () => void 0,
}: TabsProps<T>): ReactElement => {
  return (
    <ul className={styles['root']}>
      {items.map(({ id, to, text, badge }) => (
        <li key={id} className={styles['item']}>
          <Link to={to} size="lg" isActive={id === active} onClick={onChange.bind(null, id)}>
            {text}
          </Link>
          {badge && <span className={styles['badge']}>{badge}</span>}
        </li>
      ))}
    </ul>
  );
};
