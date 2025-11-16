import React from 'react';
import { useLocale } from '../contexts/LocaleContext';
import Modal from './Modal';

interface ConfirmLogoutModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({ onClose, onConfirm }) => {
  const { t } = useLocale();
  return (
    <Modal onClose={onClose} ariaLabelledBy="confirm-logout-title" showCloseButton={false}>
      <div
        className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl shadow-purple-500/20 w-full max-w-sm p-8 text-center"
      >
        <h2 id="confirm-logout-title" className="text-3xl font-bold text-white mb-4">{t('logoutConfirm.title')}</h2>
        <p className="text-gray-300 mb-8">{t('logoutConfirm.message')}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {t('logoutConfirm.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('logoutConfirm.logout')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmLogoutModal;