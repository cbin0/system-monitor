import remove from 'lodash/remove';
import { makeAutoObservable, observable, action } from 'mobx';

export const datasources = {
  libHM: {
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
  }
};

// TODO: read configuration
export default makeAutoObservable({
  ds: datasources.libHM,
  theme: 'dark',
  interval: 1000
});

export const transition = {
  enter: 'transition ease-out duration-200',
  enterFrom: 'transform opacity-0 scale-95',
  enterTo: 'transform opacity-100 scale-100',
  leave: 'transition ease-in duration-150',
  leaveFrom: 'transform opacity-100 scale-100',
  leaveTo: 'transform opacity-0 scale-95'
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
