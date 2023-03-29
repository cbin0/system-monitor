import { makeAutoObservable, action } from 'mobx';
import settings from './settings';

export default (themeEle) => {
  return makeAutoObservable({
    loaded: false,
    set themeName(name) {
      const temp = { ...this.themeVars };
      import(`../themes/${name}.jsx`).then(action((styles) => {
        Object.keys(styles.default.variables).forEach((k) => {
          temp[k] = styles.default.variables[k];
        });
        this._preflight = styles.default.preflight;
        this.classNames = styles.default.classNames;
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
    classNames: {},
    _preflight: '',
    _themeVars: {
    },
    get themeVars() {
      return this._themeVars;
    },
    set themeVars(vars) {
      let themeStyle = `[data-theme="${this.themeName}"]{${this._preflight || ''};`;
      Object.keys(vars).forEach((k) => {
        themeStyle += `--${k}: ${vars[k]};`;
      });
      themeEle.innerHTML = `${themeStyle};}`;
      this._themeVars = vars;
    }
  });
};
