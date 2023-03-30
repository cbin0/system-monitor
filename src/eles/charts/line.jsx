import React, { Fragment, useContext } from 'react';
import { darken, lighten } from 'color2k';
// import { Defs, linearGradientDef } from '@nivo/core';
import { ResponsiveLine as NivoLine } from '@nivo/line';
import { ThemeContext } from 'contexts/theme';

export const HighlightLine = ({
  series, lineGenerator, xScale, yScale
}) => {
  return series.map(({ id, data, color }) => {
    const dp = lineGenerator(
      data.map((d) => {
        return {
          x: xScale(d.data.x),
          y: yScale(d.data.y)
        };
      })
    );
    return (
      <Fragment key={id}>
        {/* <Defs
          defs={[
            {
              id: 'pattern',
              type: 'patternLines',
              background: 'transparent',
              color: '#3daff7',
              lineWidth: 1,
              spacing: 6,
              rotation: -45
            }
          ]}
        /> */}
        <path
          d={dp}
          fill="none"
          stroke={color}
          style={{
            strokeWidth: 4
          }}
        />
        <path
          d={dp}
          fill="none"
          stroke={darken(color, 0.3)}
          filter="blur(8px)"
          style={{
            strokeWidth: 3
          }}
        />
      </Fragment>
    );
  });
};

export default function L({
  className, options, children, data
}) {
  const { themeVars } = useContext(ThemeContext);
  const opt = {
    data,
    margin: {
      top: 0, right: 0, bottom: 0, left: 0
    },
    xScale: { type: 'point' },
    yScale: {
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false
    },
    yFormat: ' >-.2f',
    curve: 'basis',

    enablePoints: false,
    pointSize: 10,
    pointColor: { theme: 'background' },
    pointBorderWidth: 2,
    pointBorderColor: { from: 'serieColor' },
    pointLabelYOffset: -12,

    enableArea: true,
    areaBlendMode: 'darken',
    areaOpacity: 0.4,
    // colors: '#6a57ff',

    lineWidth: 4,
    axisLeft: null,
    axisBottom: {
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'transportation',
      legendOffset: 36,
      legendPosition: 'middle'
    },
    axisTop: null,
    axisRight: null,

    isInteractive: false,
    useMesh: false,

    animate: false,
    theme: {
      grid: {
        line: {
          stroke: themeVars.gridStroke
        }
      }
    },
    ...options
  };
  return (
    <div className={`${className || ''} h-full`}>
      <NivoLine {...opt} />
    </div>
  );
}
