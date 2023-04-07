import _default from './default';

export default {
  preflight: _default.preflight,
  classNames: {
    ..._default.classNames,
    main: `${_default.classNames.main} color-slate-2
      bg-gradient-to-br from-orange-4/80 to-red-5/80
    `,
    fps: `${_default.classNames.fps} bg-purple-6`,
    fpsDivide: `${_default.classNames.fpsDivide} bg-purple-8/90`
  },
  variables: {
    ..._default.variables,
    lineChartColor1: '#14e680',
    gridStroke: '#888',
    cardBg: 'bg-neutral-9/50',
    cardTitleBg: 'bg-zinc-8',
    lineChartBorder: 'b-1 b-slate-2'
  }
};
