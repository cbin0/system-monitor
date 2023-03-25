import _default from './default';

export default {
  ..._default,
  main: `${_default.main} text-slate-200
    bg-gradient-to-br from-stone-200/70 to-stone-700/80 backdrop-blur-lg
  `,
  cardBg: 'bg-neutral-900/50',
  cardTitleBg: 'bg-zinc-800'
};
