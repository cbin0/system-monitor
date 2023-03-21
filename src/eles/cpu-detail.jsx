import React, { useContext, useState, useEffect } from 'react';
import styled, { } from 'styled-components';
import { themeVarPrefix } from '../store/theme';
import { SysDataContext } from '../contexts/sysdata.jsx';
import Bullet from './charts/bullet.jsx';

const SingleDetail = styled.div.attrs({
  className: `
    p-2 m-6 mb-8 mt-4 text-xl
    flex flex-row items-center items-stretch
  `
})(() => `
`);

SingleDetail.Left = styled.div.attrs((props) => ({
  className: `
    basis-6em flex-shrink-0 mr-6 mb-[-6px] rounded-lg
    flex items-center justify-center text-stone-200
  `
}))(() => {
  const c = `var(--${themeVarPrefix}-chartBgFill)`;
  return `
    background: ${c};
    box-shadow: 0 0 20px -4px ${c};
  `;
});

SingleDetail.Right = styled.div.attrs({
  className: 'flex-1'
})(() => '');

export default function Cpu() {
  const { cpu } = useContext(SysDataContext);
  const [temp, setTemp] = useState({});
  const [voltage, setVoltage] = useState({});
  const [power, setPower] = useState({});
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

  useEffect(() => {
    setTemp({
      ...commonOpt,
      data: [{
        id: 'temp.',
        ranges: [
          0,
          0.000001,
          30,
          60,
          70,
          80,
          90,
          95,
          100,
          105,
          110
        ],
        measures: [
          cpu.temperature
        ],
        markers: [
          // 0,
          90
        ]
      }]
    });
  }, [cpu.temperature]);

  useEffect(() => {
    const range = Math.round(cpu.voltage + 1 / 4);
    setVoltage({
      ...commonOpt,
      data: [{
        id: 'voltage',
        ranges: [
          0,
          0.000001,
          range,
          range * 2,
          range * 3,
          range * 4
        ],
        measures: [
          cpu.voltage
        ],
        markers: [
          // 0
        ]
      }]
    });
  }, [cpu.voltage]);

  useEffect(() => {
    const range = Math.floor(cpu.power.package.max / 4);
    setPower({
      ...commonOpt,
      data: [{
        id: 'power',
        ranges: [
          0,
          0.000001,
          range,
          range * 2,
          range * 3,
          Math.ceil(cpu.power.package.max / 5) * 5
        ],
        measures: [
          cpu.power.package.value,
          cpu.power.cores.value,
          cpu.power.memory.value
        ],
        markers: [
          // 0
        ]
      }]
    });
  }, [cpu.power.total]);

  return (
    <div>
      <SingleDetail type="temp">
        <SingleDetail.Left>
          <span className="text-4xl">
            {cpu.temperature}
            <i className="i-tabler-temperature-celsius" />
          </span>
        </SingleDetail.Left>
        <SingleDetail.Right>
          <i className="
            i-carbon-temperature-celsius mr-2
            align-text-bottom text-3xl text-fuchsia-400"
          />
          Temp.
          <Bullet options={temp} className="mt-3" />
        </SingleDetail.Right>
      </SingleDetail>
      <SingleDetail type="power">
        <SingleDetail.Left>
          <span className="text-4xl">{cpu.power.package.value.toFixed(0)}</span>
          <span className="align-text-top m-[-0.5em_0_0_0.5em]">W</span>
        </SingleDetail.Left>
        <SingleDetail.Right>
          <i className="
            i-ic-round-power mr-2
            align-text-bottom text-3xl text-cyan-500"
          />
          Power
          <span className="text-base font-semibold">
            <span className="
              ml-4 pr-2 mr-2
              underline decoration-2 decoration-blue-400
              underline-offset-2"
            >
              Memory:
              {' '}
              {cpu.power.memory.value}
              w
            </span>
            <span className="
              underline decoration-2 decoration-indigo-400
              underline-offset-2"
            >
              Cores:
              {' '}
              {cpu.power.cores.value}
              w
            </span>
          </span>
          <Bullet options={power} className="mt-3" />
        </SingleDetail.Right>
      </SingleDetail>
      <SingleDetail type="voltage">
        <SingleDetail.Left>
          <span className="text-4xl">{cpu.voltage.toFixed(1)}</span>
          <span className="align-text-top m-[-0.5em_0_0_0.5em]">V</span>
        </SingleDetail.Left>
        <SingleDetail.Right>
          <i className="
            i-bi-lightning-fill mr-2
            align-text-bottom text-3xl text-amber-500"
          />
          Voltage
          <Bullet options={voltage} className="mt-3" />
        </SingleDetail.Right>
      </SingleDetail>
    </div>
  );
}
