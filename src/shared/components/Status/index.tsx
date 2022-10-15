import { FC } from 'react';

import { Badge } from 'shared/components/Badge';

import { statusData } from './data';

export type StatusProps = {
  state: 0 | 1 | 2;
};

export const Status: FC<StatusProps> = ({ state }) => {
  const { text, color } = statusData[state];

  return <Badge color={color}>{text}</Badge>;
};
