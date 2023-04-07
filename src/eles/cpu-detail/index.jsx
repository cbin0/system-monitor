import React, { useContext } from 'react';
// import styled, { } from 'styled-components';
import Power from './power';
import Temperature from './temperature';
import Voltage from './voltage';
import Memory from './memory';
import Clock from './clock';
import Fps from './fps';

const items = {
  f: Fps, t: Temperature, p: Power, c: Clock, m: Memory
};

export default function I() {
  const commonOpt = {
    rounded: 0
  };

  return (
    <div className="h-full flex flex-col justify-around p[0.5em_1em]">
      {
        Object.keys(items).map((k) => {
          const X = items[k];
          return <X key={k} commonOpt={commonOpt} />;
        })
      }
    </div>
  );
}
