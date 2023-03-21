import React, {
  createContext, useEffect, useRef
} from 'react';
import createTheme from '../store/theme';

const themeEle = document.createElement('style');

export const theme = createTheme(themeEle);

export const ThemeContext = createContext(theme);

export function ThemeProvider({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    themeEle.setAttribute('type', 'text/css');
    themeEle.setAttribute('scoped', '');
    ref.current.appendChild(themeEle);
  }, []);
  return (
    <div ref={ref}>
      <ThemeContext.Provider value={theme}>
        {theme.loaded && children}
      </ThemeContext.Provider>
    </div>
  );
}

// TODO: read config file
theme.themeName = 'dark';
