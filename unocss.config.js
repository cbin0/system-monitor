import { presetWind } from 'unocss';
import presetIcons from '@unocss/preset-icons';
import bi from '@iconify-json/bi/icons.json';
import ph from '@iconify-json/ph/icons.json';
import ri from '@iconify-json/ri/icons.json';
import ip from '@iconify-json/icon-park/icons.json';
import tb from '@iconify-json/tabler/icons.json';
import cb from '@iconify-json/carbon/icons.json';
import ic from '@iconify-json/ic/icons.json';
import rdi from '@iconify-json/radix-icons/icons.json';
import ipo from '@iconify-json/icon-park-outline/icons.json';
import svgspinner from '@iconify-json/svg-spinners';

export default {
  theme: {
    boxShadow: {
      '3xl': '14px 15px 13px -12px rgba(0,0,0,0.3)'
    }
  },
  presets: [
    presetWind({
      variablePrefix: 'sysm-'
    }),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'midde'
      },
      collections: {
        bi, ip, ipo, ph, ri, rdi, tb, cb, ic, svgspinner
      }
    })
  ],
  preflights: [{
    getCSS: () => {
      return `
      :root {
      }
    `;
    }
  }],
  shortcuts: [{
    'menu-items': `
        divide-gray-100 rounded-md bg-white shadow-lg
        ring-1 ring-black ring-opacity-5 focus:outline-none
      `,
    card: 'rounded-md shadow-3xl backdrop-blur overflow-hidden max-w-full',
    'cxy-center': 'flex flex-wrap items-center justify-center',
    square: 'aspect-square max-h-full'
  },
  [/^button(-(.*))?$/, ([, c, x]) => {
    let btn = `
      rounded-lg px-3 py-2 shadow-md inline-block
      bg-sky-6 text-stone-2 hover:bg-sky-5 active:bg-sky-8 focus:outline-none
    `;
    switch (x) {
      case 'danger': btn += 'bg-red-6 hover:bg-red-5 active:bg-red-8'; break;
      default: break;
    }
    return btn;
  }]
  ],
  rules: [
    // // content center
    // [/^cxy-center$/, () => {
    //   return {
    //     display: 'flex',
    //     'flex-wrap': 'wrap',
    //     'align-items': 'center',
    //     'justify-content': 'center'
    //   };
    // }, { layer: 'utilities' }],
    // // a square in his first parent
    // [/^square$/, ([c]) => {
    //   return {
    //     'aspect-ratio': '1 / 1',
    //     'max-height': '100%'
    //   };
    // }, { layer: 'utilities' }]
  ]
};
