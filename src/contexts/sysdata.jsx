import React, {
  createContext, useEffect, useRef
} from 'react';
import omit from 'lodash/omit';
import { fetch } from '@tauri-apps/api/http';
import { toJS, action } from 'mobx';
import createSysData from 'store/sysdata';
import settings, { messages } from 'store/settings';
import { theme } from './theme';

const sysData = createSysData(theme);

export const SysDataContext = createContext(sysData);

const iloop = {
  _started: false,
  _exec: null,
  _interval: null,
  // max timeout
  _tioMax: 4000,
  _step: 200,
  // timeout
  _tio: settings.interval,
  _error: null,
  get tio() {
    return this._tio;
  },
  set error(e) {
    this._error = e;
    if (this.tio < this._tioMax) this._tio += this._step;
  },
  async _looper() {
    try {
      await Promise.all(this._exec.map((x) => { return x(this); }));
      this.reset();
      console.log('fetching...', this);
    } catch (e) {
      this.error = e;
      messages.push({
        id: 'fetching sysdata error',
        type: 'error',
        title: 'Fetching sysdata error',
        message: `Fetching sysdata error: ${e}`
      });
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
    this._tio = settings.interval;
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

const parseValue = (v) => {
  let re = 0;
  const m = `${v}`.match(/^([.\d]+)\s?(.*)$/);
  if (!m) return re;
  re = parseFloat(m[1]) || 0;
  if (/MB/.test(m[2])) re /= 1024;
  return re;
};

const getValues = (d) => {
  return {
    min: parseValue(d.Min),
    value: parseValue(d.Value),
    max: parseValue(d.Max)
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
    switch (d.Text) {
      case 'GPU Core': sysData.gpu.usage = v; break;
      case 'GPU Memory': sysData.gpu.ram.usage = v; break;
      case 'Memory': sysData.ram.usage = v; break;
      case 'Virtual Memory': sysData.ram.virtual.usage = v; break;
      default: break;
    }
  } else if (d.Type === 'Data') {
    const v = getValues(d);
    switch (d.Text) {
      case 'Memory Used': sysData.ram.used = v; break;
      case 'Memory Available': sysData.ram.available = v; break;
      case 'Virtual Memory Used': sysData.ram.virtual.used = v; break;
      case 'Virtual Memory Available': sysData.ram.virtual.available = v; break;
      default: break;
    }
  } else if (d.Type === 'SmallData') {
    const v = getValues(d);
    switch (d.Text) {
      case 'GPU Memory Used': sysData.gpu.ram.used = v; break;
      case 'GPU Memory Free': sysData.gpu.ram.available = v; break;
      case 'GPU Memory Total': sysData.gpu.ram.total = v; break;
      default: break;
    }
  }
  d.Children.forEach((c) => {
    resolve(c, parent, ...parents);
  });
});

const getSysInfo = async (i) => {
  const info = await fetch(`http://localhost:${settings.ds.config.port.value}/data.json`, {
    method: 'GET',
    timeout: settings.ds.config.httpTimeout.value
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
