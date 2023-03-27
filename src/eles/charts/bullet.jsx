import React, { useContext } from 'react';
import styled, { } from 'styled-components';
import { ThemeContext } from 'contexts/theme';

// const borderRotation = keyframes`
//   0% { --bg-position: 0%; }
//   100% { --bg-position: 100%; }
// `;

function Bullet({ rounded, data: { value, max, colors } }) {
  const percentage = (value / max) * 100;
  let bg;
  if (colors && colors.length) bg = colors[Math.ceil(percentage / (100 / colors.length)) - 1];
  else bg = `var(--percentage-color-${Math.ceil(percentage / 10)})`;
  return (
    <div
      className={`h-full rounded-[${rounded || '999px'}]`}
      style={{
        width: `${percentage}%`,
        backgroundColor: `${bg}`
      }}
    />
  );
}

function Mark({
  title, value, max
}) {
  const percent = (value * 100) / max;
  return (
    <>
      <Mark.Top
        left={`calc(${percent}% - 50px)`}
        title={title}
      >
        <i className="i-ri-arrow-down-s-line" />
      </Mark.Top>
      <Mark.Cursor left={`${percent}%`} />
    </>
  );
}

Mark.Top = styled.div.attrs(() => {
  return {
    className: 'absolute text-center'
  };
})(({ title, left }) => {
  return `
    width: 100px;
    top: -50px;
    left: ${left};
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

Mark.Cursor = styled.div.attrs(() => {
  return {
    className: 'absolute bg-red-4/60'
  };
})(({ left }) => {
  return `
    width: 4px;
    top: 20%;
    bottom: 20%;
    left: ${left};
  `;
});

const BulletContainer = styled.div.attrs(({ rounded }) => {
  return {
    className: `h-full relative bg-transparent rounded-[${rounded || '999px'}]`
  };
})(() => {
  const { themeVars } = useContext(ThemeContext);
  return `
    > div {
      border-color: ${themeVars.chartBgFill};
      background-color: ${themeVars.chartBgFill};
      border-radius: inherit;
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
      inset: -3px;
      z-index: -1;
      background: linear-gradient(
        165deg,
        var(--bullet-bg-color-1) 0%,
        var(--bullet-bg-color-2) 30%,
        var(--bullet-bg-color-2) 70%,
        var(--bullet-bg-color-3) 100%
      );
    }

    :after {
      filter: blur(.1em);
    }
  `;
});

export default function P({ className, options: { data, rounded } }) {
  const { max, markers, markersTitles } = data;
  return (
    <div className={`${className || ''} h-full relative p1`}>
      <BulletContainer rounded={rounded}>
        <div className="relative h-full border-5">
          <Bullet rounded={rounded} data={data} />
          <div className="absolute inset-0">
            { markers && markers.map(
              (m, i) => {
                let title = markersTitles && markersTitles[i];
                if (title && title.call) title = title.call(data, m);
                else title = m;
                return (
                  <Mark
                    value={m}
                    title={title}
                    key={m}
                    max={max}
                  />
                );
              }
            )}
          </div>
        </div>
      </BulletContainer>
    </div>
  );
}
