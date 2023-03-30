import { makeAutoObservable } from 'mobx';
import settings from './settings';

export default makeAutoObservable({
  motherBoard: '',
  cpu: {
    name: '',
    brand: '',
    // speed: 0,
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
    brand: '',
    speed: {
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
