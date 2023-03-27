import React, { useContext } from 'react';
// import styled, { } from 'styled-components';
import { SysDataContext } from 'contexts/sysdata';
import Power from './power';
import Temperature from './temperature';
import Voltage from './voltage';

const items = {
  t: Temperature, p: Power, v: Voltage
};

export default function I() {
  const { cpu } = useContext(SysDataContext);
  const commonOpt = {
  };

  return (
    <div className="h-full flex flex-col justify-around p-[1em_2em]">
      {
        Object.keys(items).map((k) => {
          const X = items[k];
          return <X key={k} cpu={cpu} commonOpt={commonOpt} />;
        })
      }
    </div>
  );
}
