import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bscTestnet, } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: '大力火车',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    bscTestnet
  ],
  ssr: true,
});

export const contract = {
  'dev':{
    manager:'0x685c29952205B3C8F232733BA27F0DC63154c815',
    token:'0xe5B8F534B6dcF0199400f5E1b97DeA8D68367a68',
  }
}