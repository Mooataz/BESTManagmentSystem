import Snackbar, { type SnackbarOrigin } from '@mui/material/Snackbar';import React, { createContext, useContext, useState } from 'react';
import Alert from '@mui/material/Alert';
type NotificationType = 'success' | 'info' | 'warning' | 'error';

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
interface State extends SnackbarOrigin {
  open: boolean;
}
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  //const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [type, setType] = useState<NotificationType>('success');
const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
  });
  const notify = (message: string, notificationType: NotificationType = 'success') => {
    setMsg(message);
    setType(notificationType);
    setState({ open: true, vertical: 'bottom', horizontal: 'right' });
  };
const { vertical, horizontal, open } = state;

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ ...newState, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const mapTypeToSeverity = (type: NotificationType): 'success' | 'info' | 'warning' | 'error' => {
  switch (type) {
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
     
     
    default:
      return 'info';
  }
};

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

{/* <Snackbar
        open={open}
        autoHideDuration={6000}
         
         color={type}
        onClose={(_, reason) => {
          if (reason === 'clickaway') return;
          setOpen(false);
        }}
        message={msg}
      />  */}
        <Snackbar
        anchorOrigin={{ vertical , horizontal  }}
        open={open}
        onClose={handleClose}
        message={msg}
        key={ vertical  + horizontal}  
      >
 <Alert 
          onClose={handleClose}
          severity={mapTypeToSeverity(type)}
          variant="outlined"
          sx={{ width: '100%' }}
        >
          {msg}
        </Alert>

      </Snackbar>
    </NotificationContext.Provider>
  );
};