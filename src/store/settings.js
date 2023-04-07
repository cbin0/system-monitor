import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import {
  exists, readTextFile, BaseDirectory, writeTextFile, createDir
} from '@tauri-apps/api/fs';
import remove from 'lodash/remove';
import debounce from 'lodash/debounce';
import {
  makeAutoObservable, observable, action, autorun, toJS
} from 'mobx';
import get from 'lodash/get';
import { theme } from 'contexts/theme';

const configDir = 'config';
const configFile = `${configDir}/headlesssystemmonitor.conf`;

export const brands = [
  [/(nvidia|geforce|gtx|rtx|grace|\wgx)/i, 'nvidia'],
  [/(amd|ryzen|radeon|rdna|advantage)/i, 'amd'],
  [/(intel|core|arc|i\d)/i, 'intel']
];

export const themes = { light: 'light', dark: 'dark' };

export const intervals = {
  250: '250ms',
  500: '500ms',
  1000: '1s',
  2000: '2s',
  5000: '5s',
  10000: '10s'
};

export const datasources = makeAutoObservable({
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
      // TODO: header map
      // headerMap: {
      //   name: 'header map',
      //   value: {},
      //   type: 'object.string'
      // }
    }
  }
});

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

const settings = makeAutoObservable({
  _ds: 'libHM',
  get ds() {
    return datasources[this._ds];
  },
  set ds(id) {
    if (id in datasources) this._ds = id;
  },

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

(async () => {
  try {
    if (!await exists(configFile, { dir: BaseDirectory.AppConfig })) {
      theme.themeName = 'light';
    } else {
      const conf = JSON.parse(await readTextFile(configFile, { dir: BaseDirectory.AppConfig }));
      action(() => {
        // eslint-disable-next-line no-restricted-syntax
        for (const k of Object.keys(datasources)) {
          const config = get(conf, `datasources.${k}.config`);
          if (config) datasources[k].config = config;
        }
        if (conf.ds in datasources) settings.ds = conf.ds;
        if (conf.theme in themes) theme.themeName = conf.theme;
        if (conf.interval in intervals) settings.interval = conf.interval;
      })();
    }
    autorun(async () => {
      const content = {
        ds: settings.ds.id,
        theme: theme.themeName,
        interval: settings.interval,
        datasources: toJS(datasources)
      };
      try {
        await createDir(configDir, { dir: BaseDirectory.AppConfig, recursive: true });
        await writeTextFile(configFile, JSON.stringify(content), { dir: BaseDirectory.AppConfig });
        // messages.push({
        //   id: 'save configuration',
        //   type: 'success',
        //   title: 'Configuration saved successfully',
        //   message: `${configFile}`
        // });
      } catch (e) {
        messages.push({
          id: 'save configuration',
          type: 'error',
          title: 'Configuration saved failed',
          message: `${e}`
        });
      }
    }, {
      delay: 1000
    });
  } catch (e) {
    messages.push({
      id: 'read configuration',
      type: 'error',
      title: 'Can\'t read configuration',
      message: `${e}`
    });
  }
})();

export default settings;
