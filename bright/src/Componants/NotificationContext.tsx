// src/contexts/NotificationContext.tsx

import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from '@mui/joy';

type NotificationType = 'primary' | 'neutral' | 'danger' | 'success' | 'warning';

interface NotificationContextType {
  notify: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [type, setType] = useState<NotificationType>('success');

  const notify = (message: string, notificationType: NotificationType = 'success') => {
    setMsg(message);
    setType(notificationType);
    setOpen(true);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        autoHideDuration={4000}
        open={open}
        variant="soft"
        color={type}
        onClose={(_, reason) => {
          if (reason === 'clickaway') return;
          setOpen(false);
        }}
      >
        {msg}
      </Snackbar>
    </NotificationContext.Provider>
  );
};
