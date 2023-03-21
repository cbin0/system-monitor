import React, {
  createContext, useEffect
} from 'react';
import { fetch } from '@tauri-apps/api/http';
import { action } from 'mobx';
import { theme } from './theme';
import createSysData from '../store/sysdata';

const sysData = createSysData(theme);

export const SysDataContext = createContext(sysData);

export function SysDataProvider({ children }) {
  useEffect(() => {
    // max timeout
    const tioMax = 4000;
    const initTimeout = 1500;
    let i;
    // timeout
    let tio = initTimeout;
    const getSysInfo = async () => {
      try {
        // TODO: read configuration
        const info = await fetch('http://localhost:8085/data.json', {
          method: 'GET',
          timeout: 30
        });
        const getCore = (name) => {
          if (!/^CPU Core #\d$/.test(name)) return {};
          const coreId = parseInt(name.split('#')[1], 10);
          const core = sysData.cpu.cores[coreId - 1];
          if (!core) {
            sysData.cpu.cores[coreId - 1] = {
              name: `CPU Core #${coreId}`,
              speed: 0,
              usage: 0,
              temperature: 0,
              voltage: 0
            };
          }
          return sysData.cpu.cores[coreId - 1];
        };
        const resolve = action((d, context) => {
          let ctx = context;
          if (/mainboard.png$/.test(d.ImageURL)) sysData.motherBoard = d.Text;
          else if (/cpu.png$/.test(d.ImageURL)) {
            ctx = 'cpu';
            sysData.cpu.name = d.Text;
            sysData.cpu.brand = (d.Text.match(/^([\w\d]*)(\s|$)/) || [null, 'unknown'])[1].toLowerCase();
          } else if (d.Text === 'CPU Total') {
            ctx = 'cpu';
            sysData.cpu.usage = parseFloat(d.Value);
          } else if (d.Type === 'Voltage') {
            if (d.Text === 'CPU Core') {
              sysData.cpu.voltage.value = parseFloat(d.Value);
              sysData.cpu.voltage.max = parseFloat(d.Max);
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
              if (d.Text === 'CPU Package') sysData.cpu.power.package = v;
              if (d.Text === 'CPU Cores') sysData.cpu.power.cores = v;
              if (d.Text === 'CPU Memory') sysData.cpu.power.memory = v;
            }
          } else if (d.Type === 'Temperature') {
            if (d.Text === 'CPU Package') sysData.cpu.temperature = parseFloat(d.Value);
          }
          d.Children.forEach((c) => {
            resolve(c, ctx);
          });
        });
        resolve(info.data);
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
