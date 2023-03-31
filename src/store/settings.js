import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import remove from 'lodash/remove';
import debounce from 'lodash/debounce';
import {
  makeAutoObservable, observable, action
} from 'mobx';
// import { lazyObservable } from 'mobx-utils';

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
        value: '',
        type: 'string'
      }
    }
  }
};

export const percentChartCommonConfig = {
  maxValue: 100,
  // tracksColor: 'rgba(130, 130, 130, 0.1)',
  // tracksColor: 'transparent',
  enableTracks: false,
  startAngle: 45,
  endAngle: 405,
  cornerRadius: 5,
  padding: 0.4,
  isInteractive: false,
  enableRadialGrid: false,
  radialAxisStart: null,
  circularAxisOuter: null,
  animate: false,
  theme: {
    grid: {
      line: {
        strokeWidth: '3'
      }
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
      }), 4000);
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
      title: 'Window size saved',
      message: `Width: ${t.windowSize.width}, Height: ${t.windowSize.height}`
    });
  });
}, 400);

// TODO: read configuration
const settings = makeAutoObservable({
  _ds: datasources.libHM,
  // _ds: datasources.msiAB,
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
    applySize(this);
  }
});

appWindow.onResized(debounce(({ payload: size }) => {
  settings.setWindowSize(size);
}, 100));

settings.getWindowSize();

export default settings;
