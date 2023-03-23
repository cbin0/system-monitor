import React, { useContext } from 'react';
import { SysDataContext } from 'contexts/sysdata';

export default function C() {
  const { cpu } = useContext(SysDataContext);
  return (
    <div className="">
      cores:
      {' '}
      {cpu.cores.length}
    </div>
  );
}
