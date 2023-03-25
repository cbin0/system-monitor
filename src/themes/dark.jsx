import _default from './default';

export default {
  ..._default,
  main: `${_default.main} text-slate-200
    bg-gradient-to-br from-orange-400/80 to-red-500/80
  `,
  cardBg: 'bg-neutral-900/50',
  cardTitleBg: 'bg-zinc-800'
};
