import React, { useContext, useState, useEffect } from 'react';
// import styled, { } from 'styled-components';
// import { themeVarPrefix } from '../../store/theme';
// import { SysDataContext } from '../../contexts/sysdata.jsx';
import Power from './power.jsx';
import Temperature from './temperature.jsx';
import Voltage from './voltage.jsx';

export default function Cpu() {
  const commonOpt = {
    measureSize: 1,
    rangeBorderWidth: 0,
    measureColors: 'seq:oranges',
    markerColors: 'seq:warm',
    margin: {
      top: 0, right: 0, bottom: 0, left: 0
    },
    isInteractive: false,
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
    <div>
      <Temperature commonOpt={commonOpt} />
      <Power commonOpt={commonOpt} />
      <Voltage commonOpt={commonOpt} />
    </div>
  );
}
