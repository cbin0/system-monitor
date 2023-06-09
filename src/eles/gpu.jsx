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
    colors: [themeVars[`percentage-color-${Math.ceil(gpu.usage.value / 10)}`]]
  };

  return (
    <Card className={`${className || ''} shrink-0 flex flex-col`}>
      <Card.Title brand={gpu.brand} className="w-full">
        <i className="i-bi-gpu-card text-2xl" />
        <span className="text-md pl-2">{gpu.name || '...'}</span>
      </Card.Title>
      <Card.Body className="flex flex-col">
        <div className="mx-2 square relative">
          <Radial
            options={gpuUsageChart}
          >
            <RadialCenter>
              <span className="text-4xl text-slate-200">
                {gpu.usage.value}
                <span className="text-2xl ml-1">%</span>
              </span>
            </RadialCenter>
          </Radial>
        </div>
        <GpuDtail />
      </Card.Body>
    </Card>
  );
});
