import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'viem/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'TYOE',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    mainnet
  ],
  ssr: true,
});

export const contract = {
  'dev':{
    manager:'0x81EfCFE386b8A171E696876a2d084BAaCBD1f036',
    token:'0x14e0eaec345a52139218521791edBEb49e219686',
    nft:'0x26D85A13212433Fe6A8381969c2B0dB390a0B0ae',
    usdt:'0xdAC17F958D2ee523a2206206994597C13D831ec7'
  }
}