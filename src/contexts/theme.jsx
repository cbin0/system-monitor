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
    const el = ref.current || document.body;
    themeEle.setAttribute('type', 'text/css');
    themeEle.setAttribute('scoped', '');
    el.appendChild(themeEle);
  }, []);
  return (
    <div ref={ref}>
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </div>
  );
}
