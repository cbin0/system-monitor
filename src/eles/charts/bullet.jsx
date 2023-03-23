import React, { useContext } from 'react';
import { ResponsiveBullet } from '@nivo/bullet';
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
})(({ title, value, max }) => {
  return `
    width: 100px;
    top: -50px;
    left: calc(${(value * 100) / max}% - 50px) ;
    display: flex;
    flex-direction: column;
    align-items: center;
    :before {
      content: '${title}'
    }
    > i {
      margin-top: -7px;
    }
  `;
});

const BulletContainer = styled.div.attrs({
  className: 'h-full relative bg-transparent'
})(() => {
  const { themeVars } = useContext(ThemeContext);
  return `
    height: 100%;

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
  const opt = {
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
    measureColors: 'seq:orange_red',
    ...options
  };
  return (
    <div className={`${className || ''} h-full relative p2`}>
      <BulletContainer>
        <div className="relative z-10 h-full border-5 relative">
          <ResponsiveBullet {...opt} />
          <div className="absolute inset-0">
            { opt.data[0] && opt.data[0].markers && opt.data[0].markers.map(
              (m, i) => {
                const data = opt.data[0];
                let title = data.markersTitles && data.markersTitles[i];
                if (title && title.call) title = title.call(data, m);
                else title = m;
                return (
                  <Mark
                    value={m}
                    title={title}
                    key={m}
                    max={data.ranges[data.ranges.length - 1]}
                  >
                    <i className="i-ri-arrow-down-s-line" />
                  </Mark>
                );
              }
            )}
          </div>
        </div>
      </BulletContainer>
    </div>
  );
}
