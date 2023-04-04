import React, { useContext } from 'react';
import styled from 'styled-components';
import { ResponsiveRadialBar } from '@nivo/radial-bar';
import { ThemeContext } from 'contexts/theme';

export const RadialCenter = styled.div.attrs(() => {
  return {
    className: 'absolute rounded-full cxy-center'
  };
})(() => {
  const { themeVars } = useContext(ThemeContext);
  return `
    inset: 10.8%;
    background: linear-gradient(${themeVars.chartBgFill}, ${themeVars.chartBgFill});
    box-shadow: 0px 0px 60px -5px #444;
  `;
});

export default function P({
  className, className2, options, children
}) {
  const opt = {
    data: [],
    // maxValue: 'auto',
    maxValue: 100,
    valueFormat: (v) => { return `${v}`; },
    innerRadius: 0.55,
    enableTracks: false,
    startAngle: 45,
    endAngle: 405,
    cornerRadius: 5,
    padding: 0.4,
    margin: {
      top: 0, right: 0, bottom: 0, left: 0
    },
    // tracksColor: 'rgba(0, 0, 0, 0.15)',
    // labelsTextColor: { theme: 'labels.text.fill' },
    isInteractive: false,
    enableRadialGrid: false,
    radialAxisStart: null,
    circularAxisOuter: null,
    legends: [],
    animate: false,
    theme: {
      grid: {
        line: {
          strokeWidth: '3'
        }
      }
    },
    ...options
  };
  return (
    <div className={`${className || ''} square`}>
      <div className="scale-90 square relative m-auto">
        {children}
        <ResponsiveRadialBar {...opt} />
      </div>
    </div>
  );
}
