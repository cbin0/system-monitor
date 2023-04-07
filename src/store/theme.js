import { makeAutoObservable, action } from 'mobx';

export default (themeEle) => {
  return makeAutoObservable({
    theme: 'dark',
    loaded: false,
    set themeName(name) {
      const temp = { ...this.themeVars };
      import(`../themes/${name}.jsx`).then(action((styles) => {
        Object.keys(styles.default.variables).forEach((k) => {
          temp[k] = styles.default.variables[k];
        });
        this._preflight = styles.default.preflight;
        this.classNames = styles.default.classNames;
        this.theme = name;
        this.themeVars = temp;
        this.loaded = true;
      })).catch(() => {
        // TODO: handle error
      });
    },
    get themeName() {
      return this.theme;
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
