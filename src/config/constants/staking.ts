import BigNumber from 'bignumber.js';
import { SerializedStaking } from '@/config/constants/types';

const stakingConfig: SerializedStaking[] = [
  {
    lid: 0,
    contractAddress: {
      97: '0x2198Ae1b12048BC3E68D0E97Ba861F8515EcA853',
      56: '0x12DDa3F6a58708FeC8711761e0fbaEcd04F3E10c',
    },
    tier: 'TIER 1',
    apr: new BigNumber('200'),
    stakingDuration: '30 Days',
    lockPlan: 'Fixed',
  }, {
    lid: 1,
    contractAddress: {
      97: '0x2198Ae1b12048BC3E68D0E97Ba861F8515EcA853',
      56: '0x12DDa3F6a58708FeC8711761e0fbaEcd04F3E10c',
    },
    tier: 'TIER 2',
    apr: new BigNumber('100'),
    stakingDuration: '15 Days',
    lockPlan: 'Fixed',
  }, {
    lid: 2,
    contractAddress: {
      97: '0x2198Ae1b12048BC3E68D0E97Ba861F8515EcA853',
      56: '0x12DDa3F6a58708FeC8711761e0fbaEcd04F3E10c',
    },
    tier: 'TIER 3',
    apr: new BigNumber('20'),
    stakingDuration: '15 Days',
    lockPlan: 'Flexible',
  },
]

export default stakingConfig;
