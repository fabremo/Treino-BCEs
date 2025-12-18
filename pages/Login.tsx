
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorCode(null);
    
    if (!email || !password) {
        setError('Por favor, preencha todos os campos.');
        return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Dados de acesso inválidos.');
        setErrorCode(result.code || null);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('Falha de conexão com o servidor.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg text-white mx-auto mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">
            Treino BCEs
          </h1>
          <p className="text-slate-500 font-medium">Acesso Aluno</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-100 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 ml-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-primary outline-none transition-all text-brand-dark"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 ml-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha secreta"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-primary outline-none transition-all text-brand-dark"
              />
            </div>

            {error && (
              <div className="space-y-3">
                <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl flex items-start gap-3 border border-red-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                  </svg>
                  <span className="leading-tight">{error}</span>
                </div>

                {errorCode === 'EMAIL_NOT_CONFIRMED' && (
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 space-y-2">
                    <p className="font-bold uppercase tracking-wider">Como resolver:</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>No painel do <b>Supabase</b>, vá em <b>Authentication</b>.</li>
                      <li>Clique em <b>Users</b> e localize seu e-mail.</li>
                      <li>Clique em <b>...</b> e selecione <b>Confirm User</b>.</li>
                      <li>Ou vá em <b>Settings</b> e desative <b>Confirm Email</b>.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl text-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-primaryHover active:scale-[0.98] shadow-indigo-200'}
              `}
            >
              {isSubmitting ? 'Verificando...' : 'Acessar Treinamento'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
