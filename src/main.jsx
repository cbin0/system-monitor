import React from 'react';
import ReactDOM from 'react-dom/client';
import { observer } from 'mobx-react-lite';
import { theme, ThemeProvider } from 'contexts/theme';
import App from './app';
import '@unocss/reset/tailwind.css';
// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css';

const Loading = observer(({ children }) => {
  const allLoaded = theme.loaded;
  // TODO: read configuration
  theme.themeName = 'dark';
  return (
    <div>
      {allLoaded ? children
        : (
          <div className="absolute inset-0 text-stone-700 flex flex-col items-center justify-center">
            <i className="i-svg-spinners-90-ring text-4xl" />
            <span className="text-xl mt-4 ml-6">Loading...</span>
          </div>
        )}
    </div>
  );
});

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Loading>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Loading>
  // </React.StrictMode>
);
