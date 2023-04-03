import React, { useContext } from 'react';
// import styled, { } from 'styled-components';
import Power from './power';
import Temperature from './temperature';
import Voltage from './voltage';
import Memory from './memory';
import Clock from './clock';

const items = {
  t: Temperature, p: Power, c: Clock, m: Memory
};

export default function I() {
  const commonOpt = {
    rounded: 0
  };

  return (
    <div className="h-full flex flex-col justify-around p-[1em_2em]">
      {
        Object.keys(items).map((k) => {
          const X = items[k];
          return <X key={k} commonOpt={commonOpt} />;
        })
      }
    </div>
  );
}
