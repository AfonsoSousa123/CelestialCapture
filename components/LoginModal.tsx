import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { useLocale } from '../contexts/LocaleContext';
import Modal from './Modal';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { t } = useLocale();
  const [isLogin, setIsLogin] = useState(true);
  
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState(''); // Only used if admin
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    let success = false;
    if (isLogin) {
      success = await login(usernameOrEmail, password);
    } else {
      success = await register(name, email);
    }

    if (success) {
      onClose();
    } else {
      setError(isLogin ? t('login.error') || 'Invalid login credentials' : 'Registration failed');
    }
    setIsLoading(false);
  };

  return (
    <Modal onClose={onClose} ariaLabelledBy="login-title">
      <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl shadow-purple-500/20 w-full max-w-sm p-8">
        <h2 id="login-title" className="text-3xl font-bold text-white text-center mb-6">
          {isLogin ? (t('login.title') || 'Log In') : 'Sign Up'}
        </h2>
        
        <div className="flex mb-6 space-x-2">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-bold uppercase rounded ${isLogin ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setIsLogin(true)}
          >
            Log In
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-bold uppercase rounded ${!isLogin ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Email or Username
                </label>
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                  className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Password (optional for users)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? <LoadingSpinner /> : (isLogin ? (t('login.loginButton') || 'Log In') : 'Sign Up')}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;