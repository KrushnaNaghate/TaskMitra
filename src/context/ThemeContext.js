import React, {createContext, useContext, useState} from 'react';
import {PaperProvider} from 'react-native-paper';

// Define Light and Dark Themes with color properties
const lightTheme = {
  backgroundColor: '#ffffff',
  textColor: '#444444',
  buttonColor: '#3D5AFE',
  inputBackground: '#f2f2f2',
  inputBorderColor: '#ccc',
  errorColor: '#ff4d4d',

  placeholderColor: '#888',
  disableBackground: '#e0e0e0',
};

const darkTheme = {
  backgroundColor: '#121212',
  textColor: '#f2f2f2',
  buttonColor: '#6200EE',
  inputBackground: '#333333',
  inputBorderColor: '#444444',
  errorColor: '#ff4d4d',

  placeholderColor: '#aaa',
  disableBackground: '#1f1f1f',
};
// Create a context for the theme
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({children}) => {
  const [isDark, setIsDark] = useState(false);

  // Toggle between dark and light themes
  const toggleTheme = () => setIsDark(prevState => !prevState);

  const currentTheme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{currentTheme, toggleTheme, isDark}}>
      {/* <StatusBar barStyle={isDark ? 'dark-content' : 'light-content'} /> */}
      <PaperProvider>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};
