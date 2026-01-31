import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

import Layout from './components/Layout';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import { PlayerProvider } from './context/PlayerContext';
import { config } from './wagmi';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#2b9dee',
          accentColorForeground: 'white',
          borderRadius: 'large',
        })}>
          <PlayerProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Feed />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="upload" element={<Upload />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </PlayerProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
