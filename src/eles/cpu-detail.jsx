import React, { useContext, useState, useEffect } from 'react';
import styled, { } from 'styled-components';
import { themeVarPrefix } from '../store/theme';
import { SysDataContext } from '../contexts/sysdata.jsx';
import Bullet from './charts/bullet.jsx';

const SingleDetail = styled.div.attrs({
  className: `
    m-8 text-xl
    flex flex-row items-stretch
  `
})(() => {
  return `
`;
});

SingleDetail.Left = styled.div.attrs((props) => {
  return {
    className: `
      basis-6em flex-shrink-0 mr-6 rounded-lg
      cxy-center text-stone-200
    `
  };
})(() => {
  const c = `var(--${themeVarPrefix}-chartBgFill)`;
  return `
    background: ${c};
    box-shadow: 0 0 20px -4px ${c};
    > :nth-child(2) {
      vertical-align: text-top;
      margin: -0.5em 0 0 0.5em;
    }
  `;
});

SingleDetail.Right = styled.div.attrs({
  className: 'flex-1 overflow-hidden'
})(() => {
  return `
    > :nth-child(1) {
      vertical-align: text-bottom;
      margin-right: 0.2em;
    }
`;
});

const MoreDetail = styled.span.attrs({
  className: `
    ml-4 text-base font-semibold
    underline decoration-2
    underline-offset-2
  `
})(() => {});

const BulletChart = styled.div.attrs({
  className: 'h-11 mt-3'
})(() => {});

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
          70,
          90
        ]
      }]
    });
  }, [cpu.temperature]);

  useEffect(() => {
    const range = Math.ceil(cpu.voltage.value) / 4;
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
          cpu.voltage.value
        ],
        markers: [
          cpu.voltage.max
        ],
        markersTitles: [
          (v) => {
            return `${v.toFixed(1)}`;
          }
        ]
      }]
    });
  }, [cpu.voltage.value]);

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
          cpu.power.package.max
        ],
        markersTitles: [
          (v) => { return `${v}`; }
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
            i-carbon-temperature-celsius
            text-3xl text-fuchsia-400"
          />
          Temp.
          <BulletChart>
            <Bullet options={temp} />
          </BulletChart>
        </SingleDetail.Right>
      </SingleDetail>
      <SingleDetail type="power">
        <SingleDetail.Left>
          <span className="text-4xl">{cpu.power.package.value.toFixed(0)}</span>
          <span className="">W</span>
        </SingleDetail.Left>
        <SingleDetail.Right>
          <i className="
            i-ic-round-power
            text-3xl text-cyan-500"
          />
          Power
          <MoreDetail className=" decoration-blue-400">
            Memory:
            {' '}
            {cpu.power.memory.value}
            w
          </MoreDetail>
          <MoreDetail className=" decoration-indigo-400">
            Cores:
            {' '}
            {cpu.power.cores.value}
            w
          </MoreDetail>
          <BulletChart>
            <Bullet options={power} />
          </BulletChart>
        </SingleDetail.Right>
      </SingleDetail>
      <SingleDetail type="voltage">
        <SingleDetail.Left>
          <span className="text-4xl">{cpu.voltage.value.toFixed(1)}</span>
          <span className="">V</span>
        </SingleDetail.Left>
        <SingleDetail.Right>
          <i className="i-bi-lightning-fill text-3xl text-amber-500" />
          Voltage
          <span className="text-base font-semibold">
            <MoreDetail className=" decoration-amber-300">
              Max:
              {' '}
              {cpu.voltage.max}
              v
            </MoreDetail>
          </span>
          <BulletChart>
            <Bullet options={voltage} />
          </BulletChart>
        </SingleDetail.Right>
      </SingleDetail>
    </div>
  );
}
