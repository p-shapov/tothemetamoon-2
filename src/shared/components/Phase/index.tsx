import { FC } from 'react';

import { Badge } from 'shared/components/Badge';
import { SalePhase } from 'shared/types/salePhase';

import { phaseData } from './data';

export type PhaseProps = {
  value: SalePhase;
};

export const Phase: FC<PhaseProps> = ({ value }) => {
  const { text, color } = phaseData[value];

  return <Badge color={color}>{text}</Badge>;
};
