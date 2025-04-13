import NetInfo from '@react-native-community/netinfo';
import {useLayoutEffect, useState} from 'react';

//! Static toggle for developer fake offline mode
let forceOffline = false;

export const toggleFakeOffline = () => {
  forceOffline = !forceOffline;
  console.log('[Dev Mode] Fake Offline:', forceOffline);
};

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useLayoutEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const realStatus = state.isConnected;
      setIsConnected(forceOffline ? false : realStatus);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
};

export default useNetworkStatus;
