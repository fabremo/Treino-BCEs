import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Situations from './pages/Situations';
import SituationDetail from './pages/SituationDetail';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="cenarios" element={<Situations />} />
              <Route path="cenarios/:slug" element={<SituationDetail />} />
              <Route path="favoritos" element={<Favorites />} />
              <Route path="configuracoes" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback para 404 redireciona para home (que redirecionará para login se não auth) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;