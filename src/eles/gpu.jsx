import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { SysDataContext } from 'contexts/sysdata';
import { ThemeContext } from 'contexts/theme';
import Radial, { RadialCenter } from 'charts/radial';
import { Card } from './comps';
import GpuDtail from './gpudetail';

export default observer(({ className }) => {
  const { gpu } = useContext(SysDataContext);
  const { themeVars } = useContext(ThemeContext);
  const gpuUsageChart = {
    data: [{
      id: 'gpu usage',
      data: [
        {
          x: 'usage',
          y: gpu.usage.value
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
    colors: [themeVars[`percentage-color-${Math.ceil(gpu.usage.value / 10)}`]],
    theme: {
      grid: {
        line: {
          strokeWidth: '3'
        }
      }
    }
  };

  return (
    <>
      {/* TODO: read configure for width & height */}
      <Card className={`${className || ''} shrink-0 flex flex-col`}>
        <Card.Title brand={gpu.brand} className="w-full">
          <i className="i-bi-gpu-card text-2xl align-text-bottom" />
          <span className="text-lg pl-2">{gpu.name || '...'}</span>
        </Card.Title>
        <Card.Body>
          <div className="square relative">
            <Radial
              options={gpuUsageChart}
              className="w-full absolute top-[50%] translate-y-[-50%]"
              className2="scale-90"
            >
              <RadialCenter>
                <span className="text-4xl text-slate-200">
                  {gpu.usage.value}
                  <span className="text-xl align-bottom ml-1">%</span>
                </span>
              </RadialCenter>
            </Radial>
          </div>
          <GpuDtail />
        </Card.Body>
      </Card>
    </>
  );
});
