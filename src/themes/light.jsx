import _default from './default';

export default {
  preflight: _default.preflight,
  classNames: {
    ..._default.classNames,
    main: `${_default.classNames.main} color-slate-800
      bg-gradient-to-br from-violet-400/90 to-fuchsia-500/80
      b-slate-800
    `
  },
  variables: {
    ..._default.variables,
    chartBgFill: '#4a4a4a',
    cardBg: 'bg-zinc-200/30',
    cardTitleBg: 'bg-stone-100',
    lineChartBorder: 'b-1 b-slate-800'
  }
};
