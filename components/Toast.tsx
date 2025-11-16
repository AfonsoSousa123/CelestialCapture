import React from 'react';
import { useToast } from '../hooks/useToast';
import { Toast as ToastType } from '../types';

const Toast: React.FC<{ toast: ToastType; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const baseClasses = 'flex items-center w-full max-w-xs p-4 space-x-4 text-gray-200 divide-x divide-gray-600 rounded-lg shadow-lg';
  const typeClasses = {
    success: 'bg-green-800/80 backdrop-blur-md',
    error: 'bg-red-800/80 backdrop-blur-md',
  };

  const Icon: React.FC<{ type: ToastType['type'] }> = ({ type }) => {
    if (type === 'success') {
      return (
        <svg className="w-5 h-5 text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
      );
    }
    return null; // Add error icon if needed
  };

  return (
    <div className={`${baseClasses} ${typeClasses[toast.type]} animate-fadeInUp`} role="alert">
      <div className="flex-shrink-0">
        <Icon type={toast.type} />
      </div>
      <div className="pl-4 text-sm font-normal">{toast.message}</div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-auto -mx-1.5 -my-1.5 p-1.5 text-gray-400 hover:text-white rounded-lg focus:ring-2 focus:ring-gray-300 inline-flex items-center justify-center h-8 w-8"
        aria-label="Close"
      >
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
  );
};


const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) {
        return null;
    }
    
    return (
        <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[200]">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
                ))}
            </div>
        </div>
    );
}

export default ToastContainer;
