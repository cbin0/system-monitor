import React, {
  createContext, useEffect, useRef
} from 'react';
import { fetch } from '@tauri-apps/api/http';
import { action } from 'mobx';
import createSysData from 'store/sysdata';
import { theme } from './theme';

const sysData = createSysData(theme);

export const SysDataContext = createContext(sysData);

// TODO: read configuration
const initTimeout = 1000;
const timeout = 5;
const iloop = {
  timeout,
  initTimeout,
  _started: false,
  _exec: null,
  _interval: null,
  // max timeout
  _tioMax: 4000,
  _step: 200,
  // timeout
  _tio: initTimeout,
  _error: null,
  get tio() {
    return this._tio;
  },
  set error(e) {
    this._error = e;
    if (this.tio < this._tioMax) this._tio += this._step;
  },
  _looper() {
    try {
      this._exec.forEach((x) => { return x(this); });
      this.reset();
      console.log('fetching...', this);
    } catch (e) {
      this.error = e;
      console.error('fetching sysdata error ->', e);
    }
    this._interval = setTimeout(this._looper.bind(this), this.tio);
  },
  start(...exec) {
    if (this._started) this.stop();
    this._started = true;
    this._exec = exec;
    this._looper();
  },
  stop() {
    this._started = false;
    clearTimeout(this._interval);
    this.reset();
  },
  reset() {
    this._interval = null;
    this._tio = this.initTimeout;
  }
};

const getSysInfo = async (i) => {
  // TODO: read configuration
  const info = await fetch('http://localhost:8085/data.json', {
    method: 'GET',
    timeout: i.timeout
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
};

export function SysDataProvider({ children }) {
  useEffect(() => {
    iloop.start(getSysInfo);
    return () => {
      iloop.stop();
    };
  }, []);

  return (
    <SysDataContext.Provider value={sysData}>
      {children}
    </SysDataContext.Provider>
  );
}
