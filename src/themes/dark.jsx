import _default from './default';

export default {
  preflight: _default.preflight,
  classNames: {
    ..._default.classNames,
    main: `${_default.classNames.main} text-slate-200
      bg-gradient-to-br from-orange-400/80 to-red-500/80
    `
  },
  variables: {
    ..._default.variables,
    lineChartColor1: '#14e680',
    gridStroke: '#888',
    cardBg: 'bg-neutral-900/50',
    cardTitleBg: 'bg-zinc-800'
  }
};
