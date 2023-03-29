import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { SysDataContext } from 'contexts/sysdata';
import { ThemeContext } from 'contexts/theme';
import Radial, { RadialCenter } from 'charts/radial';
import { percentChartCommonConfig } from 'store/settings';
import { Card } from './comps';

export default observer(({ className }) => {
  const { motherBoard, cpu } = useContext(SysDataContext);
  const { themeVars } = useContext(ThemeContext);
  const cpuUsageChart = {
    ...percentChartCommonConfig,
    data: [{
      id: 'cpu usage',
      data: [
        {
          x: 'usage',
          y: cpu.usage.value
        }
      ]
    }],
    colors: [themeVars[`percentage-color-${Math.ceil(cpu.usage.value / 10)}`]]
  };

  return (
    <Card className={`${className || ''} shrink-0 flex flex-col`}>
      <Card.Title brand={cpu.brand} className="w-full">
        <i className="i-ph-cpu text-2xl" />
        <span className="text-lg pl-2">{cpu.name || '...'}</span>
        <div className="pl-2 ">
          <i className="i-radix-icons-corner-bottom-left mr-1 text-xl" />
          <span className="text-slate-400">{motherBoard || '...'}</span>
        </div>
      </Card.Title>
      <Card.Body>
        <Radial
          options={cpuUsageChart}
          className="w-full absolute top-[50%] translate-y-[-50%]"
          className2="scale-90"
        >
          <RadialCenter>
            <span className="text-4xl text-slate-200">
              {cpu.usage.value}
              <span className="text-2xl ml-1">%</span>
            </span>
          </RadialCenter>
        </Radial>
      </Card.Body>
    </Card>
  );
});
