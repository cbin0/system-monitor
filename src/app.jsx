import React, { useContext } from 'react';
// import { invoke } from '@tauri-apps/api/tauri';
// import reactLogo from './assets/react.svg';
import { observer } from 'mobx-react-lite';
import Eles from './eles/index.jsx';
import { ThemeContext } from './contexts/theme.jsx';
import { SysDataProvider } from './contexts/sysdata.jsx';

export default observer(() => {
  const theme = useContext(ThemeContext);

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke('greet', { name }));
  // }

  return (
    <div data-theme={theme.themeName} className={theme.themeVars.main}>
      <select value={theme.themeName} onChange={(v) => { theme.themeName = v.target.value; }}>
        <option value="dark">dark</option>
        <option value="light">light</option>
      </select>
      <SysDataProvider>
        <Eles />
      </SysDataProvider>
    </div>
  );
});
