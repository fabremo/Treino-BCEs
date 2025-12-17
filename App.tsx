import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Situations from './pages/Situations';
import SituationDetail from './pages/SituationDetail';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cenarios" element={<Situations />} />
          <Route path="cenarios/:slug" element={<SituationDetail />} />
          <Route path="favoritos" element={<Favorites />} />
          <Route path="configuracoes" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;