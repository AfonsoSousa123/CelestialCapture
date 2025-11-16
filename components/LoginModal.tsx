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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        onClose();
      } else {
        setError(t('login.error'));
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <Modal onClose={onClose} ariaLabelledBy="login-title">
      <div
        className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl shadow-purple-500/20 w-full max-w-sm p-8"
      >
        <h2 id="login-title" className="text-3xl font-bold text-white text-center mb-6">{t('login.title')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
              {t('login.usernameLabel')}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
              {t('login.passwordLabel')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? <LoadingSpinner /> : t('login.loginButton')}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;