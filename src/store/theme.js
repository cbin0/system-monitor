import { makeAutoObservable, action } from 'mobx';
import settings from './settings';

export default (themeEle) => {
  return makeAutoObservable({
    loaded: false,
    set themeName(name) {
      const temp = { ...this.themeVars };
      import(`../themes/${name}.jsx`).then(action((styles) => {
        Object.keys(styles.default).forEach((k) => {
          temp[k] = styles.default[k];
        });
        settings.theme = name;
        this.themeVars = temp;
        this.loaded = true;
      })).catch(() => {
        // TODO: handle error
      });
    },
    get themeName() {
      return settings.theme;
    },
    _themeVars: {
    },
    get themeVars() {
      return this._themeVars;
    },
    set themeVars(vars) {
      let themeStyle = `[data-theme="${this.themeName}"]{`;
      Object.keys(vars).forEach((k) => {
        themeStyle += `--${k}: ${vars[k]};`;
      });
      themeEle.innerHTML = `${themeStyle};}`;
      this._themeVars = vars;
    }
  });
};
