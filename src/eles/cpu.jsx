import React, { useContext } from 'react';
import { lighten, darken } from 'polished';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { SysDataContext } from '../contexts/sysdata.jsx';
import { ThemeContext } from '../contexts/theme.jsx';
import Radial from './charts/radial.jsx';
import CpuDetail from './cpu-detail.jsx';

const Cpuname = styled.div(() => {
  const { cpu } = useContext(SysDataContext);
  const { themeVars } = useContext(ThemeContext);
  const c = themeVars[`${cpu.brand}-main-color`];
  console.log(cpu.brand);
  return cpu.brand && `
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    padding: 1em 1em 0;
    :after {
      content: '';
      display: block;
      height: 4px;
      margin: 1em -1em 0;
      box-shadow: 0 8px 30px ${lighten(0.2, c)}, 0 4px 20px ${lighten(0.2, c)};
      background: linear-gradient(90deg, ${c}, ${lighten(0.2, c)}, ${lighten(0.4, c)})
    }`;
});

const ChartCenter = styled.div(() => {
  const { themeVars } = useContext(ThemeContext);
  return `
    inset: 10.8%;
    background: linear-gradient(${themeVars.chartBgFill}, ${themeVars.chartBgFill});
    box-shadow: 0px 0px 60px -5px #444;
  `;
});

function Card({ className, children }) {
  return (
    <div className={`
      ${className || ''}
      rounded-md h-96 flex flex-col shadow-3xl bg-opi backdrop-blur`}
    >
      {children}
    </div>
  );
}

export default observer(() => {
  const { motherBoard, cpu } = useContext(SysDataContext);
  const { themeVars } = useContext(ThemeContext);
  const cpuUsageChart = {
    data: [{
      id: 'cpu usage',
      data: [
        {
          x: 'usage',
          y: cpu.usage
        }
      ]
    }],
    maxValue: 100,
    // tracksColor: 'rgba(130, 130, 130, 0.1)',
    // tracksColor: 'transparent',
    enableTracks: false,
    startAngle: 45,
    endAngle: 405,
    cornerRadius: 5,
    padding: 0.4,
    isInteractive: false,
    enableRadialGrid: false,
    radialAxisStart: null,
    circularAxisOuter: null,
    colors: [themeVars[`cpu-usage-rs-color-${Math.ceil(cpu.usage / 10)}`]],
    theme: {
      grid: {
        line: {
          strokeWidth: '3'
        }
      }
    }
  };

  return (
    <div className="p-4 flex grid-cols-3 gap-4">
      <Card className="basis-80 flex-shrink-0">
        <Cpuname className={`${themeVars.cpuNameBg}`}>
          <i className="i-ph-cpu text-2xl align-text-bottom" />
          <span className="text-lg pl-2">{cpu.name}</span>
          <div className="pl-2 ">
            <i className="i-radix-icons-corner-bottom-left mr-1 text-xl" />
            {/* <span className="mr-2">Mother board:</span> */}
            <span className="text-slate-400">{motherBoard}</span>
          </div>
        </Cpuname>
        <div className={`
          ${themeVars.cardBg}
          rounded-b-inherit
          grow-1 shrink-0 pt-6 backdrop-blur backdrop-opacity-50`}
        >
          <div className="relative m-auto w-60 h-60">
            <ChartCenter className="absolute flex rounded-full items-center justify-center">
              <span className="text-4xl text-slate-200">
                {cpu.usage}
                <span className="text-xl align-bottom ml-1">%</span>
              </span>
            </ChartCenter>
            <Radial options={cpuUsageChart} />
          </div>
        </div>
      </Card>
      <Card className={`rounded basis-40 flex-1 flex-shrink-0 ${themeVars.cardBg}`}>
        <CpuDetail />
      </Card>
    </div>
  );
});
