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
        bi, ip, ipo, ph, ri, rdi, tb, cb, ic
      }
    })
  ],
  preflights: [{
    getCSS: () => `
      :root {
        --intel-main-color: #007cc1;
        --amd-main-color: #ed1f23;
        --nvidia-main-color: #71b000;

        --bullet-bg-color-1: #a3ff6e;
        --bullet-bg-color-2: #ffad32;
        --bullet-bg-color-3: #ff5c5c;
        --bullet-bg-color-4: #f72d2d;
      }
    `
  }],
  rules: [
  ]
};