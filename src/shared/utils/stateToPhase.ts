import { SalePhase } from 'shared/types/salePhase';
import { SaleState } from 'shared/types/saleStatus';

export const stateToPhase = (state: SaleState): SalePhase => {
  switch (state) {
    case 0:
      return 'soon';
    case 1:
      return 'available';
    case 2:
      return 'finished';
  }
};
