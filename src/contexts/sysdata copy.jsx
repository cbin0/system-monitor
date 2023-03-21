import React, {
  createContext, useEffect, useState
} from 'react';
import { fetch } from '@tauri-apps/api/http';

export const SysDataContext = createContext();

export function SysDataProvider({ children }) {
  const [sysData, setSysData] = useState(initSysData());

  useEffect(() => {
    // max timeout
    const tioMax = 4000;
    const initTimeout = 1500;
    let i;
    // timeout
    let tio = initTimeout;
    const getSysInfo = async () => {
      try {
        const temp = initSysData();
        const info = await fetch('http://localhost:8085/data.json', {
          method: 'GET',
          timeout: 30
        });
        const getCore = (name) => {
          if (!/^CPU Core #\d$/.test(name)) return {};
          const coreId = parseInt(name.split('#')[1], 10);
          const core = temp.cpu.cores[coreId - 1];
          if (!core) {
            temp.cpu.cores[coreId - 1] = {
              name: `CPU Core #${coreId}`,
              speed: 0,
              usage: 0,
              temperature: 0,
              voltage: 0
            };
          }
          return temp.cpu.cores[coreId - 1];
        };
        const resolve = (d, context) => {
          let ctx = context;
          if (/mainboard.png$/.test(d.ImageURL)) temp.motherBoard = d.Text;
          else if (/cpu.png$/.test(d.ImageURL)) {
            ctx = 'cpu';
            temp.cpu.name = d.Text;
            temp.cpu.brand = (d.Text.match(/^([\w\d]*)(\s|$)/) || [null, 'unknown'])[1].toLowerCase();
          } else if (d.Text === 'CPU Total') {
            ctx = 'cpu';
            temp.cpu.usage = parseFloat(d.Value);
          } else if (d.Type === 'Voltage') {
            if (d.Text === 'CPU Core') {
              temp.cpu.voltage = parseFloat(d.Value);
            } else if (ctx === 'cpu') {
              const core = getCore(d.Text);
              core.voltage = parseFloat(d.Value);
            }
          } else if (d.Type === 'Clock') {
            if (ctx === 'cpu') {
              const core = getCore(d.Text);
              core.speed = parseFloat(d.Value);
            }
          } else if (d.Type === 'Power') {
            if (ctx === 'cpu') {
              const v = {
                min: parseFloat(d.Min),
                value: parseFloat(d.Value),
                max: parseFloat(d.Max)
              };
              if (d.Text === 'CPU Package') temp.cpu.power.package = v;
              if (d.Text === 'CPU Cores') temp.cpu.power.cores = v;
              if (d.Text === 'CPU Memory') temp.cpu.power.memory = v;
            }
          } else if (d.Type === 'Temperature') {
            if (d.Text === 'CPU Package') temp.cpu.temperature = parseFloat(d.Value);
          }
          d.Children.forEach((c) => {
            resolve(c, ctx);
          });
        };
        resolve(info.data);
        setSysData(temp);
        tio = initTimeout;
      } catch (error) {
        console.error('error ->', error);
        if (tio < tioMax) tio += 200;
      }
      i = setTimeout(getSysInfo, tio);
    };
    getSysInfo();
    return () => {
      clearTimeout(i);
    };
  }, []);

  return (
    <SysDataContext.Provider value={sysData}>
      {children}
    </SysDataContext.Provider>
  );
}
