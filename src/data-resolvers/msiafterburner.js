import { action } from 'mobx';
import { invoke } from '@tauri-apps/api/tauri';
import sysData from 'store/sysdata';
import settings, { messages } from 'store/settings';
import { toNum } from './utils';

const headers = {};
const temp = [];

const trim = (x) => {
  const r = x.replace(/(\\r)?\\n/, '').trim();
  if (r === '\\xef\\xbf\\xbdC') return 'celsius';
  return r;
};

const getValue = (name) => {
  const x = (temp[headers[name]] || [name, {}])[1];
  return {
    ...x,
    value: toNum(`${x.value}${x.unit}`),
    min: toNum(`${x.min}${x.unit}`),
    max: toNum(`${x.max}${x.unit}`)
  };
};

const getLogFile = () => {
  if (!settings.ds.config.logFile.value) {
    messages.push({
      id: 'msi log file',
      type: 'warn',
      title: 'No log file',
      message: 'Please select msi afterburner log file.'
    });
    return null;
  }
  return settings.ds.config.logFile.value;
};

const resolve = (d) => {
  if (d[1].err) {
    messages.push({
      id: 'msi get log data',
      type: 'error',
      title: 'Cant\'t get msi afterburner log data',
      message: `Get msi afterburner log data: ${d[1].err}.`
    });
    return;
  }

  action(() => {
    if (!d[1].data) return;
    d[1].data.forEach((x) => {
      x.split(',').forEach((c, i) => {
        if (i < 2) return;
        if (i === 0 && trim(c) !== '80') return;
        temp[i - 2][1].value = trim(c);
      });
    });
    sysData.ram.usage.value = (d[0].ram.used * 100) / d[0].ram.total;
    sysData.ram.used.value = d[0].ram.used;
    sysData.ram.available.value = d[0].ram.available;
    sysData.gpu.usage.value = getValue('GPU usage').value;
    sysData.gpu.temperature.value = getValue('GPU temperature').value;
    const gpuPower = getValue('Power');
    sysData.gpu.power.package.value = gpuPower.value;
    sysData.gpu.power.package.min = gpuPower.min;
    sysData.gpu.power.package.max = gpuPower.max;
    const gpuRam = getValue('Memory usage');
    sysData.gpu.ram.used.value = gpuRam.value;
    sysData.gpu.ram.total.value = gpuRam.max;
    sysData.gpu.ram.usage.value = (gpuRam.value * 100) / gpuRam.max;
    sysData.cpu.temperature.value = getValue('CPU temperature').value;
    const cpuPower = getValue('CPU power');
    sysData.cpu.power.package.value = cpuPower.value;
    sysData.cpu.power.package.max = cpuPower.max;
    const cpuClock = getValue('CPU clock');
    sysData.cpu.clock.value = cpuClock.value;
    sysData.cpu.clock.max = cpuClock.max;
    sysData.cpu.usage.value = getValue('CPU usage').value.toFixed(0);
    sysData.frame.frametime = getValue('Frametime').value;
    sysData.frame.min = getValue('Framerate Min').value;
    sysData.frame.avg = getValue('Framerate Avg').value;
    sysData.frame.max = getValue('Framerate Max').value;
    sysData.frame['1%low'] = getValue('Framerate 1% Low').value;
    sysData.frame['0.1%low'] = getValue('Framerate 0.1% Low').value;
  })();
  console.log('temp:', temp);
};

const getHeaders = () => {
  const logFile = getLogFile();
  if (!logFile) return null;
  return invoke('msi_log_headers', { logFile }).then(action((x) => {
    console.log('msi_log_headers', x);
    let err = null;
    if (x.err) {
      if (x.err_type === 'open file') {
        err = `Can't open file, is <${logFile}> exist?`;
      }
    }
    sysData.gpu.name = trim(x.gpu_name);
    x.headers.forEach((e, i) => {
      if (i === 0 && e.trim() !== '02') {
        err = 'File format wrong, is this a msi afterburner log file?';
      }
      if (i > 1) {
        const headerI = i - 2;
        headers[trim(e)] = headerI;
        temp[headerI] = [
          trim(e), {
            value: '',
            unit: trim(x.header_detail[headerI][3]),
            min: trim(x.header_detail[headerI][4]),
            max: trim(x.header_detail[headerI][5])
          }
        ];
      }
    });
    console.log('msi headers:', temp.length, temp);
    if (err) {
      messages.push({
        id: 'msi get log headers',
        type: 'error',
        title: 'Cant\'t get msi afterburner log headers',
        message: `Get msi afterburner log headers: ${x.err}. ${err}`
      });
    }
    return x;
  }));
};

export default {
  init() {
    getHeaders();
  },

  async getSysInfo() {
    const logFile = getLogFile();
    if (!logFile) return {};
    if (!temp.length) { await getHeaders(); }
    return invoke('msi_read_log', { logFile, lineCount: 1 });
  },

  resolve(data) {
    resolve(data);
  }
};
