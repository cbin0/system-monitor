import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import remove from 'lodash/remove';
import debounce from 'lodash/debounce';
import {
  makeAutoObservable, observable, action
} from 'mobx';

export const brands = [
  [/(nvidia|geforce|gtx|rtx|grace|\wgx)/i, 'nvidia'],
  [/(amd|ryzen|radeon|rdna|advantage)/i, 'amd'],
  [/(intel|core|arc|i\d)/i, 'intel']
];

export const datasources = {
  libHM: {
    id: 'libHM',
    name: 'Libre Hardware Monitor',
    config: {
      port: {
        name: 'port',
        value: 8085,
        type: 'number'
      },
      httpTimeout: {
        name: 'http timeout',
        value: 3,
        type: 'number',
        unit: 'seconds'
      }
    }
  },
  msiAB: {
    id: 'msiAB',
    name: 'MSI AfterBurner',
    config: {
      logFile: {
        name: 'log file',
        value: 'E:/program/MSI Afterburner/HardwareMonitoring.hml',
        type: 'string'
      }
      // TODO: header map
      // headerMap: {
      //   name: 'header map',
      //   value: {},
      //   type: 'object.string'
      // }
    }
  }
};

export const messages = observable({
  timeouts: {},
  data: [],
  push(m) {
    action(() => {
      clearTimeout(this.timeouts[m.id]);
      remove(this.data, (x) => { return x.id === m.id; });
      this.data.push(m);
      this.timeouts[m.id] = setTimeout(action(() => {
        remove(this.data, (x) => { return x.id === m.id; });
      }), 5000);
    })();
  }
});

const applySize = debounce((t) => {
  appWindow.setSize(new LogicalSize(
    t.windowSize.width,
    t.windowSize.height
  )).then(() => {
    t.getWindowSize();
    messages.push({
      id: 'change window size',
      type: 'success',
      title: 'Window size',
      message: `Width: ${t.windowSize.width}, Height: ${t.windowSize.height}`
    });
  });
}, 400);

// TODO: read configuration
const settings = makeAutoObservable({
  // _ds: datasources.libHM,
  _ds: datasources.msiAB,
  get ds() {
    return this._ds;
  },
  set ds(id) {
    this.changeDs(id);
  },
  changeDs(id) {
    this._ds = datasources[id];
  },

  theme: 'dark',
  interval: 1000,
  maxSnapshots: 20,
  windowSize: {
    width: 1400,
    height: 900
  },
  getWindowSize() {
    appWindow.innerSize().then(action((x) => {
      this.windowSize = x;
    }));
  },
  setWindowSize({ width, height }) {
    this.windowSize = {
      width: Math.min(+width || this.windowSize.width, 10000),
      height: Math.min(+height || this.windowSize.height, 5000)
    };
  },
  applySize() {
    applySize(this);
  }
});

appWindow.onResized(debounce(({ payload: size }) => {
  settings.setWindowSize(size);
}, 100));

settings.getWindowSize();

export default settings;
