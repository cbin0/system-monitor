import _default from './default';

export default {
  preflight: _default.preflight,
  classNames: {
    ..._default.classNames,
    main: `${_default.classNames.main} text-slate-800
      bg-gradient-to-br from-violet-400/90 to-fuchsia-500/80
    `
  },
  variables: {
    ..._default.variables,
    chartBgFill: '#4a4a4a',
    cardBg: 'bg-zinc-200/50',
    cardTitleBg: 'bg-stone-100'
  }
};
