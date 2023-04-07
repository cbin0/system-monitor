import { makeAutoObservable, computed } from 'mobx';
import settings, { brands } from './settings';

function getBrand(d) {
  const re = brands.find((x) => { return x[0].test(d); });
  return re ? re[1] : 'unknown';
}

export default makeAutoObservable({
  name: '',
  motherBoard: '',
  cpu: {
    name: '',
    get brand() {
      return getBrand(this.name);
    },
    clock: {
      value: 0,
      max: 0
    },
    usage: {
      value: 0,
      max: 0
    },
    temperature: {
      value: 0,
      max: 0
    },
    voltage: {
      value: 0,
      max: 0
    },
    power: {
      package: {
        min: 0,
        value: 0,
        max: 0
      },
      cores: {
        min: 0,
        value: 0,
        max: 0
      },
      memory: {
        min: 0,
        value: 0,
        max: 0
      },
      get total() {
        return this.package.value;
      }
    },
    cores: []
  },
  ram: {
    usage: {
      value: 0,
      max: 0
    },
    used: {
      value: 0,
      max: 0
    },
    available: {
      value: 0,
      max: 0
    },
    virtual: {
      usage: {
        value: 0,
        max: 0
      },
      used: {
        value: 0,
        max: 0
      },
      available: {
        value: 0,
        max: 0
      }
    }
  },
  gpu: {
    name: '',
    get brand() {
      return getBrand(this.name);
    },
    clock: {
      value: 0,
      max: 0
    },
    usage: {
      value: 0,
      max: 0
    },
    temperature: {
      value: 0,
      max: 0
    },
    voltage: {
      value: 0,
      max: 0
    },
    ram: {
      used: {
        value: 0,
        max: 0
      },
      available: {
        value: 0,
        max: 0
      },
      total: {
        value: 0,
        max: 0
      },
      usage: {
        value: 0,
        max: 0
      }
    },
    power: {
      package: {
        min: 0,
        value: 0,
        max: 0
      }
    }
  },
  processes: {
    count: 0
  },
  frame: {
    framerate: 0,
    frametime: 0,
    min: 0,
    max: 0,
    avg: 0,
    '1%low': 0,
    '0.1%low': 0
  },

  _snapshots: [],
  push(v) {
    this._snapshots.splice(settings.maxSnapshots - 1);
    this._snapshots.unshift(v);
  },
  get snapshots() {
    const snapshots = this._snapshots;
    while (snapshots.length < settings.maxSnapshots) {
      snapshots.push({
        time: `placeholder${snapshots.length}`,
        cpu: {
          usage: {
            value: 0,
            max: 0
          }
        }
      });
    }
    return snapshots;
  }
});
