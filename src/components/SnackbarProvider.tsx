import React, {createContext, ReactNode, useContext, useState} from 'react';
import {Snackbar} from 'react-native-paper';

interface SnackbarContextType {
  showToast: (message: string, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [duration, setDuration] = useState<number>(3000);

  const showToast = (msg: string, time: number = 3000) => {
    setMessage(msg);
    setDuration(time);
    setVisible(true);
  };

  const hideToast = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{showToast}}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideToast}
        duration={duration}
        action={{label: 'OK', onPress: hideToast}}>
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
