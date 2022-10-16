import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

export const formatToEth = (bigNumber: BigNumber) => Number(formatEther(bigNumber));
