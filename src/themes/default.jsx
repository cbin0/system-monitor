import { darken, lighten } from 'color2k';

export default {
  preflight: '',
  classNames: {
    main: `
      h-[100vh] overflow-auto rounded-lg backdrop-blur-lg font-[poppins]
    `,
    fps: 'p2 px1 flex gap2 items-center justify-evenly rounded-md text-xl',
    fpsDivide: 'self-center w1 h2 rounded-lg'
  },
  variables: {
    chartBgFill: '#333',
    'error-bg': '#ffd7d7df',
    'error-color': darken('#ff6666', 0.4),
    'warn-bg': '#f9f053f2',
    'warn-color': darken('#f9f053', 0.4),
    'success-bg': '#61fa6bf1',
    'success-color': darken('#61fa6b', 0.4),

    'intel-main-color': '#007cc1',
    'amd-main-color': '#ed1f23',
    'nvidia-main-color': '#71b000',
    'unknown-main-color': '#e925cc',

    'temperature-color': '#e879f9',
    'power-color': '#06b6d4',
    'voltage-color': '#f59e0b',
    'memory-color': '#dd635f',
    'clock-color': '#6dfe25',

    'bullet-bg-color-1': '#fff',
    'bullet-bg-color-2': 'transparent',
    'bullet-bg-color-3': '#fff',
    // 'bullet-bg-color-4': '#888',

    lineChartColor1: '#6a57ff',
    gridStroke: '#eee',

    'percentage-color-1': '#51ff4e',
    'percentage-color-2': '#96ff22',
    'percentage-color-3': '#d4ff29',
    'percentage-color-4': '#ecef24',
    'percentage-color-5': '#efcd24',
    'percentage-color-6': '#ffad32',
    'percentage-color-7': '#ef7722',
    'percentage-color-8': '#ff5c5c',
    'percentage-color-9': '#e93b3b',
    'percentage-color-10': '#f72d2d'
  }
};
