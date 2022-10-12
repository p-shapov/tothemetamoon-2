import { FC } from 'react';

import { ico_chevronDown } from 'shared/icons/chevronDown';
import { ico_chevronUp } from 'shared/icons/chevronUp';
import { clamp } from 'shared/utils/clamp';

import styles from './Counter.module.scss';

export type CounterProps = {
  children: number;
  min?: number;
  max: number;
  format?(value: number): string;
  onChange?(value: number): void;
};

export const Counter: FC<CounterProps> = ({
  children,
  min = 0,
  max,
  format = (value) => value,
  onChange = () => void 0,
}) => {
  const handleDecrease = () => {
    if (children > min) onChange(children - 1);
  };

  const handleIncrease = () => {
    if (children < max) onChange(children + 1);
  };

  return (
    <div className={styles['root']}>
      <button className={styles['control']} type="button" onClick={handleDecrease}>
        {ico_chevronDown}
      </button>
      <span>{format(clamp(min, max)(children))}</span>
      <button className={styles['control']} type="button" onClick={handleIncrease}>
        {ico_chevronUp}
      </button>
    </div>
  );
};

export const CounterWithMax: FC<Omit<CounterProps, 'format'>> = (props) => (
  <Counter {...props} format={(value) => `${value}/${props.max}`} />
);
