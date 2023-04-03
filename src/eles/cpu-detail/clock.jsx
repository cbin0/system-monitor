import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Bullet from 'charts/bullet';
import { SysDataContext } from 'contexts/sysdata';
import { ThemeContext } from 'contexts/theme';
import { SingleDetail, BulletChart, MoreDetail } from './partials';

export default observer(({ commonOpt }) => {
  const { cpu } = useContext(SysDataContext);
  const { themeVars } = useContext(ThemeContext);
  const clock = {
    ...commonOpt,
    data: {
      value: cpu.clock.value,
      max: Math.ceil(cpu.clock.max) + 1,
      colors: [themeVars['percentage-color-4'], themeVars['percentage-color-5']],
      markers: [
        cpu.clock.max
      ],
      markersTitles: [
        (v) => {
          return `${v.toFixed(1)} GHz`;
        }
      ]
    }
  };

  return (
    <SingleDetail type="clock">
      <SingleDetail.Left>
        <span className="text-4xl">{cpu.clock.value.toFixed(1)}</span>
        <span className="">GHz</span>
      </SingleDetail.Left>
      <SingleDetail.Right>
        <i className="i-ic-baseline-speed text-3xl clock" />
        Clock
        <BulletChart>
          <Bullet options={clock} />
        </BulletChart>
      </SingleDetail.Right>
    </SingleDetail>
  );
});
