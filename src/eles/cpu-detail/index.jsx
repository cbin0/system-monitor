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
    measureSize: 1,
    rangeBorderWidth: 0,
    measureColors: 'seq:oranges',
    markerColors: 'seq:warm',
    margin: {
      top: 0, right: 0, bottom: 0, left: 0
    },
    isInteractive: false,
    animate: false,
    theme: {
      axis: {
        ticks: {
          line: {
            strokeWidth: 0
          },
          text: {
          }
        }
      },
      grid: {
        line: {
          strokeWidth: 0
        }
      }
    }
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
