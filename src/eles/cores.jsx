import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { SysDataContext } from 'contexts/sysdata';

export default observer(() => {
  const { cpu } = useContext(SysDataContext);
  return (
    <div className="">
      cores:
      {' '}
      {cpu.cores.length}
    </div>
  );
});
