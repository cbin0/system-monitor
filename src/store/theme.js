import { makeAutoObservable, action } from 'mobx';

export const themeVarPrefix = 'theme';

export default (themeEle) => makeAutoObservable({
  loaded: false,
  _themeName: '',
  set themeName(name) {
    const temp = { ...this.themeVars };
    import(`../themes/${name}.jsx`).then(action((styles) => {
      Object.keys(styles.default).forEach((k) => {
        temp[k] = styles.default[k];
      });
      this._themeName = name;
      this.themeVars = temp;
      this.loaded = true;
    })).catch(() => {
      // TODO:
    });
  },
  get themeName() {
    return this._themeName;
  },
  _themeVars: {
    'intel-main-color': '#007cc1',
    'amd-main-color': '#ed1f23',
    'nvidia-main-color': '#71b000',

    'bullet-bg-color-1': '#a3ff6e',
    'bullet-bg-color-2': '#ffad32',
    'bullet-bg-color-3': '#ff5c5c',
    'bullet-bg-color-4': '#f72d2d'
  },
  get themeVars() {
    return this._themeVars;
  },
  set themeVars(vars) {
    let themeStyle = `[data-theme="${this.themeName}"]{`;
    Object.keys(vars).forEach((k) => {
      themeStyle += `--${themeVarPrefix}-${k}: ${vars[k]};`;
    });
    themeEle.innerHTML = `${themeStyle};}`;
    this._themeVars = vars;
  }
});
