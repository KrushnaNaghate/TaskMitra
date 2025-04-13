import React, {createContext, useContext, useState} from 'react';
import {Snackbar} from 'react-native-paper';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({children}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(3000);

  const showToast = (msg, time = 3000) => {
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
