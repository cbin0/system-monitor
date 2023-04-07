import _default from './default';

export default {
  preflight: _default.preflight,
  classNames: {
    ..._default.classNames,
    main: `${_default.classNames.main} color-slate-8
      bg-gradient-to-br from-violet-4/90 to-fuchsia-5/80
      b-slate-8
    `,
    fps: `${_default.classNames.fps} ring-2 ring-slate-8 bg-stone-1`,
    fpsDivide: `${_default.classNames.fpsDivide} bg-red-5`
  },
  variables: {
    ..._default.variables,
    chartBgFill: '#4a4a4a',
    cardBg: 'bg-zinc-2/40',
    cardTitleBg: 'bg-stone-1',
    lineChartBorder: 'b-1 b-slate-8'
  }
};
