import { action } from 'mobx';

const getBrand = (d) => {
  return (d.Text.match(/^([\w\d]*)(\s|$)/) || [null, 'unknown'])[1].toLowerCase();
};

const resolve = action((d) => {
});

export default {
  async getSysInfo() {
    // TODO:
  },

  resolve(data) {
    resolve(data);
  }
};
