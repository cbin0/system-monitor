import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { SysDataContext } from 'contexts/sysdata';
import { ThemeContext } from 'contexts/theme';
import Radial, { RadialCenter } from 'charts/radial';
import Line, { HighlightLine } from 'charts/line';
import { percentChartCommonConfig } from 'store/settings';
import { Card } from './comps';

function Snapshots() {
  const { snapshots } = useContext(SysDataContext);
  const { themeVars } = useContext(ThemeContext);
  const data = [{
    id: 'cpu usage',
    // color: '#6a57ff',
    data: snapshots.map((x) => {
      return {
        x: x.time,
        y: x.cpu.usage.value
      };
    })
  }];
  const opt = {
    yScale: {
      type: 'linear',
      min: 0,
      max: 100,
      stacked: true,
      reverse: false
    },
    margin: {
      top: 0, right: -1, bottom: 0, left: -1
    },
    colors: [themeVars.lineChartColor1],
    layers: ['grid', 'areas', HighlightLine]
  };

  return (
    <div className="h-25">
      <Line options={opt} data={data} />
    </div>
  );
}

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
          <i className="i-radix-icons-corner-bottom-left align-base mr-1 text-xl" />
          <span className="text-slate-400">{motherBoard || '...'}</span>
        </div>
      </Card.Title>
      <Card.Body>
        <Radial
          options={cpuUsageChart}
          className=""
          className2="scale-90"
        >
          <RadialCenter>
            <span className="text-4xl text-slate-200">
              {cpu.usage.value}
              <span className="text-2xl ml-1">%</span>
            </span>
          </RadialCenter>
        </Radial>
        <Snapshots />
      </Card.Body>
    </Card>
  );
});
