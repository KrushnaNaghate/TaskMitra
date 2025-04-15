import NetInfo from '@react-native-community/netinfo';
import {useLayoutEffect, useState} from 'react';

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useLayoutEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
};

export default useNetworkStatus;
