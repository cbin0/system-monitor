import React, { useContext } from 'react';
import { lighten, darken } from 'polished';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { SysDataContext } from 'contexts/sysdata';
import { ThemeContext } from 'contexts/theme';
import Radial, { RadialCenter } from 'charts/radial';
import CpuDetail from './cpu-detail/index';
import Cores from './cores';

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

function Card({ className, children }) {
  return (
    <div className={`${className || ''} card`}>
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
    animate: false,
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
    <div className="p-4 flex flex-wrap gap-4">
      {/* TODO: read configure for width & height */}
      <Card className="w-90 h-110 shrink-0">
        <Cpuname className={`${themeVars.cpuNameBg} h-[90px] w-full`}>
          <i className="i-ph-cpu text-2xl align-text-bottom" />
          <span className="text-lg pl-2">{cpu.name}</span>
          <div className="pl-2 ">
            <i className="i-radix-icons-corner-bottom-left mr-1 text-xl" />
            <span className="text-slate-400">{motherBoard}</span>
          </div>
        </Cpuname>
        <div
          className={`
            rounded-b-inherit ${themeVars.cardBg}
            backdrop-blur backdrop-opacity-50
            h-[calc(100%-90px)]
          `}
        >
          <Radial
            options={cpuUsageChart}
            className="w-full absolute top-[50%] translate-y-[-50%]"
            className2="scale-90"
          >
            <RadialCenter>
              <span className="text-4xl text-slate-200">
                {cpu.usage}
                <span className="text-xl align-bottom ml-1">%</span>
              </span>
            </RadialCenter>
          </Radial>
        </div>
      </Card>
      <Card className={`basis-150 flex-1 ${themeVars.cardBg}`}>
        <CpuDetail />
      </Card>
      <Card className={`w-full flex-shrink-0 ${themeVars.cardBg}`}>
        <Cores />
      </Card>
    </div>
  );
});
