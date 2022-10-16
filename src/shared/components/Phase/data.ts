import { BadgeProps } from 'shared/components/Badge';
import { SalePhase } from 'shared/types/salePhase';

export const phaseData: Record<SalePhase, { text: string; color: NonNullable<BadgeProps['color']> }> = {
  soon: { text: 'Soon', color: 'violet' },
  available: { text: 'Available now', color: 'green' },
  finished: { text: 'Finished', color: 'violet' },
};
