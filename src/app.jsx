import React, { useContext } from 'react';
// import reactLogo from './assets/react.svg';
import { observer } from 'mobx-react-lite';
import { ThemeContext } from 'contexts/theme';
import { SysDataProvider } from 'contexts/sysdata';
import Eles from './eles';

export default observer(() => {
  const theme = useContext(ThemeContext);

  return (
    <div data-theme={theme.themeName} className={theme.classNames.main}>
      <SysDataProvider>
        <Eles />
      </SysDataProvider>
    </div>
  );
});
