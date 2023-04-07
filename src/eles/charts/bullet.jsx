import React, { useContext } from 'react';
import styled, { } from 'styled-components';
import { observer } from 'mobx-react-lite';
import { ThemeContext } from 'contexts/theme';

// const borderRotation = keyframes`
//   0% { --bg-position: 0%; }
//   100% { --bg-position: 100%; }
// `;

function Bullet({ xrounded, data: { value, max, colors } }) {
  const percentage = Math.min((value / max) * 100, 100);
  let bg;
  if (colors && colors.length) bg = colors[Math.ceil(percentage / (100 / colors.length)) - 1];
  else bg = `var(--percentage-color-${Math.ceil(percentage / 10)})`;
  return (
    <div className="h-full overflow-hidden">
      <div
        className="h-full"
        style={{
          width: `${percentage}%`,
          backgroundColor: `${bg}`,
          borderRadius: xrounded
        }}
      />
    </div>
  );
}

function Mark({
  title, value, max
}) {
  const percent = (value * 100) / max;
  return (
    <>
      <Mark.Top
        percent={percent}
        title={title}
      >
        <i className="i-ri-arrow-down-s-line" />
      </Mark.Top>
      <Mark.Cursor percent={percent} />
    </>
  );
}

Mark.Top = styled.div.attrs(() => {
  return {
    className: 'absolute text-center'
  };
})(({ title, percent }) => {
  return `
    width: 100px;
    top: -50px;
    left: ${percent}%;
    transform: translate(-50%, 0px);
    display: flex;
    flex-direction: column;
    align-items: center;
    :before {
      content: '${title}';
      white-space: nowrap;
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
})(({ percent }) => {
  return `
    width: 4px;
    top: 20%;
    bottom: 20%;
    left: ${percent}%;
    transform: translate(-50%, 0px);
  `;
});

const BulletContainer = styled.div.attrs(() => {
  return {
    className: 'h-full relative bg-transparent'
  };
})(observer(({ xrounded }) => {
  const { themeVars } = useContext(ThemeContext);
  return `
    border-radius: ${xrounded};

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
      inset: -1px;
      z-index: -1;
      // background: linear-gradient(
      //   165deg,
      //   var(--bullet-bg-color-1) 0%,
      //   var(--bullet-bg-color-2) 30%,
      //   var(--bullet-bg-color-2) 70%,
      //   var(--bullet-bg-color-3) 100%
      // );
      background: var(--bullet-bg-color-1);
    }

    :after {
      filter: blur(.1em);
    }
  `;
}));

export default function P({ className, options: { data, rounded } }) {
  const { max, markers, markersTitles } = data;
  const xrounded = rounded === undefined ? '999px' : rounded;
  return (
    <div className={`${className || ''} h-full relative p1`}>
      <BulletContainer rounded={xrounded}>
        <div className="relative h-full border-5">
          <Bullet rounded={xrounded} data={data} />
          <div className="absolute inset-0">
            { max > 0 && markers && markers.map(
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
