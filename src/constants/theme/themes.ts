import {DefaultTheme} from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: '#ffffff',
    text: '#000000',
    disabled: 'rgba(0, 0, 0, 0.26)',
    placeholder: 'rgba(0, 0, 0, 0.54)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#f50057',
    card: '#ffffff',
    border: '#e0e0e0',
  },
};

export const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#bb86fc',
    accent: '#03dac6',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    disabled: 'rgba(255, 255, 255, 0.38)',
    placeholder: 'rgba(255, 255, 255, 0.54)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#cf6679',
    card: '#1e1e1e',
    border: '#333333',
  },
};

export type AppTheme = typeof lightTheme;
