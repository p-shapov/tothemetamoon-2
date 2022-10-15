import { BadgeProps } from 'shared/components/Badge';

export const statusData: Record<0 | 1 | 2, { text: string; color: NonNullable<BadgeProps['color']> }> = {
  0: { text: 'Soon', color: 'violet' },
  1: { text: 'Available now', color: 'green' },
  2: { text: 'Finished', color: 'violet' },
};
