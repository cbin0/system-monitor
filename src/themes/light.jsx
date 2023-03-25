import _default from './default';

export default {
  ..._default,
  main: `${_default.main} text-slate-800
    bg-gradient-to-br from-violet-400/90 to-fuchsia-500/80
  `,
  chartBgFill: '#4a4a4a',
  cardBg: 'bg-zinc-200/60',
  cardTitleBg: 'bg-stone-100'
};
