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
};

const darkTheme = {
  backgroundColor: '#121212',
  textColor: '#f2f2f2',
  buttonColor: '#6200EE',
  inputBackground: '#333333',
  inputBorderColor: '#444444',
  errorColor: '#ff4d4d',
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
      <PaperProvider>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};
