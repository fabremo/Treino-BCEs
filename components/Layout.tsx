
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex-1 text-center py-4 px-2 text-sm sm:text-base font-bold transition-all duration-300 relative flex items-center justify-center rounded-t-lg ${
      isActive
        ? 'text-brand-accent bg-slate-800 shadow-inner'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    }`;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-background">
      {/* Fixed Professional Header */}
      <header className="fixed top-0 left-0 right-0 bg-brand-dark shadow-card z-50 border-b border-slate-700">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none">
                  Treino BCEs
                </h1>
                <p className="text-xs text-slate-400 font-medium">Inglês Pra Viagem</p>
              </div>
            </div>

            {/* Logoff Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold transition-colors text-sm sm:text-base group"
              aria-label="Sair do sistema"
            >
              <span className="hidden sm:inline">Sair</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </button>
          </div>
          
          {/* Modern Tabs Navigation */}
          <nav className="flex justify-between bg-brand-dark px-2 sm:px-4 pt-2 overflow-x-auto">
            <NavLink to="/" className={linkClasses}>
              Início
            </NavLink>
            <NavLink to="/cenarios" className={linkClasses}>
              Cenários
            </NavLink>
            <NavLink to="/simulador" className={linkClasses}>
              Simulador
            </NavLink>
            <NavLink to="/favoritos" className={linkClasses}>
              Favoritos
            </NavLink>
            <NavLink to="/configuracoes" className={linkClasses}>
              Ajustes
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-36 sm:pt-40 pb-12 px-4 sm:px-6 w-full max-w-3xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
