import settings, { messages } from 'store/settings';
import { action, toJS } from 'mobx';
import { invoke } from '@tauri-apps/api/tauri';
import sysData from 'store/sysdata';
import resovers from './index';

export default class Resolver {
  resolve([baseInfo, data]) {
    sysData.name = baseInfo.name;
    sysData.cpu.name = baseInfo.cpu.name;
    // sysData.ram.used.value = baseInfo.ram.used / 1048576;
    // sysData.ram.available.value = baseInfo.ram.available / 1048576;
    sysData.processes.count = baseInfo.processes;
    resovers[settings.ds.id].resolve([baseInfo, data]);
    console.log('resolved:', sysData);
    sysData.push({
      time: Date.now(),
      cpu: {
        usage: toJS(sysData.cpu.usage)
      }
    });
    return this;
  }

  async getSysInfo() {
    return Promise.all([
      invoke('sys_base_info', { }),
      resovers[settings.ds.id].getSysInfo()
    ]).then(action((x) => {
      console.log('data:', x);
      this.resolve(x);
    }));
  }

  iloop = {
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
      if (e && this.tio < this._tioMax) this._tio += this._step;
    },
    async _looper() {
      try {
        await Promise.all(this._exec.map((x) => { return x(this); }));
        this.reset();
        if (this._error) {
          this.error = null;
          messages.push({
            id: 'fetching sysdata',
            type: 'success',
            title: 'Resolver started',
            message: `${settings.ds.name} has started`
          });
        }
      } catch (e) {
        this.error = e;
        messages.push({
          id: 'fetching sysdata',
          type: 'error',
          title: 'Fetching sysdata error',
          message: `Fetching sysdata error: ${e}`
        });
      }
      this._interval = setTimeout(this._looper.bind(this), this.tio);
    },
    start(...exec) {
      if (this._started) this.stop();
      if (exec.length) this._exec = exec;
      if (resovers[settings.ds.id].init) resovers[settings.ds.id].init();
      this._started = true;
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

  stop() {
    this.iloop.stop();
    messages.push({
      id: 'resolver stop',
      type: 'warn',
      title: 'Resolver stoped',
      message: `${settings.ds.name} has stopped`
    });
  }

  restart() {
    this.iloop.start();
  }

  constructor() {
    this.iloop.start(this.getSysInfo.bind(this));
  }
}
