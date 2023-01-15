import BigNumber from 'bignumber.js';
import { SerializedStaking } from '@/config/constants/types';

const stakingConfig: SerializedStaking[] = [
  {
    lid: 0,
    contractAddress: {
      97: '0x259070c81103e06313888DA13ae0B65B6accacf6',
      56: '',
    },
    tier: 'TIER 1',
    apr: new BigNumber('200'),
    stakingDuration: '30 Days',
    lockPlan: 'Fixed',
  }, {
    lid: 1,
    contractAddress: {
      97: '0x259070c81103e06313888DA13ae0B65B6accacf6',
      56: '',
    },
    tier: 'TIER 2',
    apr: new BigNumber('100'),
    stakingDuration: '15 Days',
    lockPlan: 'Fixed',
  }, {
    lid: 2,
    contractAddress: {
      97: '0x259070c81103e06313888DA13ae0B65B6accacf6',
      56: '',
    },
    tier: 'TIER 3',
    apr: new BigNumber('20'),
    stakingDuration: '15 Days',
    lockPlan: 'Flexible',
  },
]

export default stakingConfig;
