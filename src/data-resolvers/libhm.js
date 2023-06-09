import { fetch } from '@tauri-apps/api/http';
import omit from 'lodash/omit';
import { action } from 'mobx';
import settings, { messages } from 'store/settings';
import sysData from 'store/sysdata';
import { toNum, getCore } from './utils';

const aThread = /^CPU Core #(\d)( Thread #(\d))?$/;

const libhmGetCore = (name) => {
  const x = name.match(aThread);
  if (!x) return {};
  const coreId = parseInt(x[1], 10);
  const threadId = parseInt(x[3], 10);
  return [getCore(coreId - 1), threadId];
};

const getValues = (d) => {
  return {
    min: toNum(d.Min),
    value: toNum(d.Value),
    max: toNum(d.Max)
  };
};

const resolve = action((d, ...parents) => {
  const parent = omit(d, 'Children');
  if (/mainboard.png$/.test(d.ImageURL)) sysData.motherBoard = d.Text;
  // CPU
  else if (/cpu.png$/.test(d.ImageURL)) {
    resolve.ctx = 'cpu';
    sysData.cpu.name = d.Text;
  } else if (d.Text === 'CPU Total') {
    resolve.ctx = 'cpu';
    sysData.cpu.usage = getValues(d);
  } else if (d.Type === 'Voltage') {
    if (d.Text === 'CPU Core') {
      sysData.cpu.voltage = getValues(d);
    } else if (resolve.ctx === 'cpu') libhmGetCore(d.Text)[0].voltage = getValues(d);
  } else if (d.Type === 'Clock') {
    if (resolve.ctx === 'cpu') {
      const core = libhmGetCore(d.Text)[0];
      if (core) {
        core.clock = getValues(d);
        sysData.cpu.clock.value = Math.max(sysData.cpu.clock.value, core.clock.value);
        sysData.cpu.clock.max = Math.max(sysData.cpu.clock.max, core.clock.max);
      }
    }
    if (resolve.ctx === 'gpu') {
      if (d.Text === 'GPU Core') sysData.gpu.clock = getValues(d);
    }
  } else if (d.Type === 'Power') {
    const v = getValues(d);
    if (d.Text === 'CPU Package') sysData.cpu.power.package = v;
    if (d.Text === 'CPU Cores') sysData.cpu.power.cores = v;
    if (d.Text === 'CPU Memory') sysData.cpu.power.memory = v;
    if (d.Text === 'GPU Package') {
      resolve.ctx = 'gpu';
      sysData.gpu.name = parents[1].Text;
      sysData.gpu.power.package = v;
    }
  } else if (d.Type === 'Temperature') {
    if (d.Text === 'CPU Package') sysData.cpu.temperature = getValues(d);
    else if (resolve.ctx === 'cpu') {
      const core = libhmGetCore(d.Text)[0];
      if (core) {
        core.temperature = getValues(d);
      }
    }
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
    if (aThread.test(d.Text)) {
      const [core, t] = libhmGetCore(d.Text);
      core.threads[t - 1].usage = v;
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

export default {
  async getSysInfo() {
    const info = await fetch(`http://localhost:${settings.ds.config.port.value}/data.json`, {
      method: 'GET',
      timeout: settings.ds.config.httpTimeout.value
    });
    return info.data;
  },

  resolve([baseInfo, data]) {
    resolve.ctx = '';
    sysData.cpu.clock.value = 0;
    sysData.cpu.clock.max = 0;
    sysData.frame.frametime = 0;
    sysData.frame.framerate = 0;
    sysData.frame.min = 0;
    sysData.frame.avg = 0;
    sysData.frame.max = 0;
    sysData.frame['1%low'] = 0;
    sysData.frame['0.1%low'] = 0;
    resolve(data);
  }
};
