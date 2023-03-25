import React, {
  createContext, useEffect, useRef
} from 'react';
import omit from 'lodash/omit';
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

const getValues = (d) => {
  return {
    min: parseFloat(d.Min) || 0,
    value: parseFloat(d.Value) || 0,
    max: parseFloat(d.Max) || 0
  };
};

const getBrand = (d) => {
  return (d.Text.match(/^([\w\d]*)(\s|$)/) || [null, 'unknown'])[1].toLowerCase();
};

const resolve = action((d, ...parents) => {
  const parent = omit(d, 'Children');
  if (/mainboard.png$/.test(d.ImageURL)) sysData.motherBoard = d.Text;
  // CPU
  else if (/cpu.png$/.test(d.ImageURL)) {
    resolve.ctx = 'cpu';
    sysData.cpu.name = d.Text;
    sysData.cpu.brand = getBrand(d);
  } else if (d.Text === 'CPU Total') {
    resolve.ctx = 'cpu';
    sysData.cpu.usage = getValues(d);
  } else if (d.Type === 'Voltage') {
    if (d.Text === 'CPU Core') {
      sysData.cpu.voltage = getValues(d);
    } else if (resolve.ctx === 'cpu') getCore(d.Text).voltage = getValues(d);
  } else if (d.Type === 'Clock') {
    if (resolve.ctx === 'cpu') getCore(d.Text).speed = getValues(d);
    if (resolve.ctx === 'gpu') {
      if (d.Text === 'GPU Core') sysData.gpu.speed = getValues(d);
    }
  } else if (d.Type === 'Power') {
    const v = getValues(d);
    if (d.Text === 'CPU Package') sysData.cpu.power.package = v;
    if (d.Text === 'CPU Cores') sysData.cpu.power.cores = v;
    if (d.Text === 'CPU Memory') sysData.cpu.power.memory = v;
    if (d.Text === 'GPU Package') {
      resolve.ctx = 'gpu';
      sysData.gpu.name = parents[1].Text;
      sysData.gpu.brand = getBrand(parents[1]);
      sysData.gpu.power.package = v;
    }
  } else if (d.Type === 'Temperature') {
    if (d.Text === 'CPU Package') sysData.cpu.temperature = getValues(d);
    else if (resolve.ctx === 'cpu') getCore(d.Text).temperature = getValues(d);
    if (d.Text === 'GPU Core') sysData.gpu.temperature = getValues(d);
  } else if (d.Type === 'Load') {
    const v = getValues(d);
    if (d.Text === 'GPU Core') sysData.gpu.usage = v;
    if (d.Text === 'GPU Memory') sysData.gpu.ram = v;
  }
  d.Children.forEach((c) => {
    resolve(c, parent, ...parents);
  });
});

const getSysInfo = async (i) => {
  // TODO: read configuration
  const info = await fetch('http://localhost:8085/data.json', {
    method: 'GET',
    timeout: i.timeout
  });
  resolve.ctx = '';
  resolve(info.data);
  // console.log(sysData);
  // console.log(sysData.gpu.usage);
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
