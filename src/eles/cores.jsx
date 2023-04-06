import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import get from 'lodash/get';
import { SysDataContext } from 'contexts/sysdata';
import { ThemeContext } from 'contexts/theme';
import Line, { HighlightLine } from 'charts/line';

function Snapshots({ core, thread, type }) {
  const { snapshots } = useContext(SysDataContext);
  const { themeVars } = useContext(ThemeContext);
  const data = [{
    id: 'thread usage',
    data: snapshots.map((x) => {
      return {
        x: x.time,
        y: get(x.cpu, `cores[${core}].threads[${thread}][${type}].value`, 0)
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
      top: 0, right: 0, bottom: 0, left: 0
    },
    colors: [themeVars.lineChartColor1],
    layers: ['grid', 'areas', HighlightLine],
    theme: {
      grid: {
        line: null
      }
    }
  };

  return (
    <div className={`h-15 flex-1 ${themeVars.lineChartBorder}`}>
      <Line options={opt} data={data} />
    </div>
  );
}

export default observer(() => {
  const { cpu } = useContext(SysDataContext);
  const [show, setShow] = useState(false);
  let w = 25;
  if (cpu.cores.length <= 12) {
    switch (cpu.cores.length) {
      case 4: w = 50; break;
      case 6: w = 33.33333333; break;
      default: break;
    }
  }
  return (
    <>
      <div className="p4 flex items-center hover:opacity-80">
        <i className={`text-2xl mr2 ${show ? 'i-ic:round-keyboard-arrow-down' : 'i-ic:round-keyboard-arrow-right'}`} />
        <button type="button" onClick={() => { setShow(!show); }}>
          Cores:
          {' '}
          {cpu.cores.length}
        </button>
      </div>
      {show && (
      <div className="flex flex-wrap gap6 p4 pt-0">
        {cpu.cores.map(({
          name, temperature, clock, threads
        }, c) => {
          return (
            <div style={{ width: `calc(${w}% - 0.75em)` }} className="">
              <div>
                <span className="text-2xl mr4">{`#${c + 1}`}</span>
                <span className="text-md">
                  {temperature.value}
                  <i className="i-carbon-temperature-celsius ml1 align-mid" />
                </span>
                <span className="mx2">/</span>
                <span className="text-md">
                  {clock.value.toFixed(1)}
                  {' '}
                  GHz
                </span>
              </div>
              <div className="gap2 flex">
                {threads.map((x, t) => {
                  return <Snapshots core={c} thread={t} type="usage" />;
                })}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </>
  );
});
