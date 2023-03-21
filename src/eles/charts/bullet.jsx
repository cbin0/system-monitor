import React, { useContext } from 'react';
import { ResponsiveBullet } from '@nivo/bullet';
import defaults from 'lodash/defaults';
import styled, { keyframes } from 'styled-components';
import { ThemeContext } from '../../contexts/theme';

// const borderRotation = keyframes`
//   0% { --bg-position: 0%; }
//   100% { --bg-position: 100%; }
// `;

const Mark = styled.div.attrs(({ value }) => {
  return {
    className: 'absolute text-center'
  };
})(({ value, max }) => {
  return `
    width: 80px;
    top: -46px;
    left: calc(${(value * 100) / max}% - 40px) ;
    display: flex;
    flex-direction: column;
    align-items: center;
    :before {
      content: '${value}'
    }
    > i {
      margin-top: -10px;
    }
  `;
});

const BulletContainer = styled.div(() => {
  const { themeVars } = useContext(ThemeContext);
  return `
    background: transparent;
    height: 30px;

    > div {
      border-color: ${themeVars.chartBgFill}
    }

    // @property --border-angle {
    //   syntax: '<angle>';
    //   initial-value: 0deg;
    //   inherits: false;
    // }

    // @property --bg-position {
    //   syntax: '<percent>';
    //   initial-value: 0%;
    //   inherits: false;
    // }

    :before,
    :after {
      content: '';
      border-radius: inherit;
      position: absolute;
      inset: -4px;
      z-index: 9;
      background: linear-gradient(
        // from var(--border-angle),
        90deg,
        var(--bullet-bg-color-1),
        var(--bullet-bg-color-2),
        var(--bullet-bg-color-3),
        var(--bullet-bg-color-4)
        // var(--bullet-bg-color-2),
        // var(--bullet-bg-color-1)
      );
    }

    :after {
      filter: blur(.2em);
    }
  `;
});

export default function P({ className, options }) {
  const { themeVars } = useContext(ThemeContext);
  const opt = defaults(options, {
    data: [],
    margin: {
      top: 50, right: 90, bottom: 50, left: 90
    },
    spacing: 46,
    titleAlign: 'start',
    titleOffsetX: -70,
    rangeBorderColor: { from: 'color', modifiers: [] },
    measureSize: 0.2,
    rangeColors: [themeVars.chartBgFill],
    measureColors: 'seq:orange_red'
  });
  return (
    <BulletContainer className={`${className} relative p-0`}>
      <div className="relative z-10 h-full border-5 relative">
        <ResponsiveBullet {...opt} />
        <div className="absolute inset-0">
          {
            opt.data[0] && opt.data[0].markers && opt.data[0].markers.map(
              (m) => {
                return (
                  <Mark
                    value={m}
                    key={m}
                    max={opt.data[0].ranges[opt.data[0].ranges.length - 1]}
                  >
                    <i className="i-ri-arrow-down-s-line" />
                  </Mark>
                );
              }
            )
          }
        </div>
      </div>
    </BulletContainer>
  );
}
