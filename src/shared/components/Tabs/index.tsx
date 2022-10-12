import { ReactElement } from 'react';

import { Link } from 'shared/components/Link';
import { Badge, BadgeProps } from 'shared/components/Badge';

import styles from './Tabs.module.scss';

export type TabsProps<T extends string> = {
  active: T;
  items: Array<{ id: T; to?: string; text: string; badge?: { color: BadgeProps['color']; text: string } }>;
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
          <Link to={to} size="lg" isActive={to === active} onClick={onChange.bind(null, id)}>
            {text}
          </Link>
          {badge && (
            <span className={styles['badge']}>
              <Badge color={badge.color}>{badge.text}</Badge>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};
