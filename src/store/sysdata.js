import { makeAutoObservable } from 'mobx';

export default (theme) => makeAutoObservable({
  motherBoard: '',
  cpu: {
    name: '',
    brand: '',
    // speed: 0,
    usage: 0,
    temperature: 0,
    voltage: 0,
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
  ram: ''
});
