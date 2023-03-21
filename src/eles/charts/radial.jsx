import React from 'react';
import { ResponsiveRadialBar } from '@nivo/radial-bar';
import defaults from 'lodash/defaults';

export default function P({ options }) {
  const opt = defaults(options, {
    data: [],
    maxValue: 'auto',
    valueFormat: (v) => { return `${v}`; },
    endAngle: 360,
    innerRadius: 0.55,
    padding: 0.6,
    cornerRadius: 45,
    margin: {
      top: 0, right: 0, bottom: 0, left: 0
    },
    tracksColor: 'rgba(0, 0, 0, 0.15)',
    labelsTextColor: { theme: 'labels.text.fill' },
    legends: []
  });
  return (
    <ResponsiveRadialBar {...opt} />
  );
}
