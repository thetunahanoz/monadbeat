import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';

// Define Monad Testnet Chain
const monadTestnet = {
    id: 10143,
    name: 'Monad Testnet',
    iconUrl: 'https://pbs.twimg.com/profile_images/1632766761595191297/Ff52b6Fm_400x400.jpg',
    iconBackground: '#fff',
    nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://testnet-rpc.monad.xyz'] },
    },
    blockExplorers: {
        default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
    },
};

export const config = getDefaultConfig({
    appName: 'MonadBeat',
    projectId: 'YOUR_PROJECT_ID', // Get one from cloud.walletconnect.com
    chains: [monadTestnet],
    transports: {
        [monadTestnet.id]: http(),
    },
});
