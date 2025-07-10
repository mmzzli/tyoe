import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  bsc,
} from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: '大力火车',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    bsc
  ],
  ssr: true,
});
