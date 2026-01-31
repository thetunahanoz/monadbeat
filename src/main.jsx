import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import { PlayerProvider } from './context/PlayerContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
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
  </React.StrictMode>,
);
