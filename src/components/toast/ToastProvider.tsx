import React, { createContext, useCallback, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { CheckCircle, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
}

function ToastProvider({ children }: ToastProviderProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');

  const showToast = useCallback((msg: string, toastType: ToastType = 'success') => {
    setMessage(msg);
    setType(toastType);
    setOpen(false);
    requestAnimationFrame(() => {
      setOpen(true);
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className={`
            flex items-center gap-3 rounded-lg p-4 shadow-lg border 
            ${type === 'success' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}
          `}
        >
          {type === 'success' ? (
            <CheckCircle className="text-green-600" size={24} />
          ) : (
            <XCircle className="text-red-600" size={24} />
          )}

          <Toast.Title className="text-sm font-medium text-gray-900">
            {message}
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport
          className="fixed bottom-4 right-4 flex flex-col gap-2 w-96 max-w-full z-50"
        />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
