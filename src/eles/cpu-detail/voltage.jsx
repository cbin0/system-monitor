import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Bullet from 'charts/bullet';
import { SysDataContext } from 'contexts/sysdata';
import { ThemeContext } from 'contexts/theme';
import { SingleDetail, BulletChart, MoreDetail } from './partials';

export default observer(({ commonOpt }) => {
  const { cpu } = useContext(SysDataContext);
  const { themeVars } = useContext(ThemeContext);
  // const range = Math.ceil(cpu.voltage.value) / 4;
  // const voltage = {
  //   ...commonOpt,
  //   data: [{
  //     id: 'voltage',
  //     ranges: [
  //       0,
  //       0.000001,
  //       range,
  //       range * 2,
  //       range * 3,
  //       range * 4
  //     ],
  //     measures: [
  //       cpu.voltage.value
  //     ],
  //     markers: [
  //       cpu.voltage.max
  //     ],
  //     markersTitles: [
  //       (v) => {
  //         return `${v.toFixed(1)}`;
  //       }
  //     ]
  //   }]
  // };

  const voltage = {
    ...commonOpt,
    data: {
      value: cpu.voltage.value,
      max: cpu.voltage.max + (Math.floor((cpu.voltage.max - 1) / 5) || 0.3),
      colors: [themeVars['percentage-color-4'], themeVars['percentage-color-5']],
      markers: [
        cpu.voltage.max
      ],
      markersTitles: [
        (v) => {
          return `Max. ${v.toFixed(1)} v`;
        }
      ]
    }
  };

  return (
    <SingleDetail type="temp">
      <SingleDetail.Left>
        <span className="text-4xl">{cpu.voltage.value.toFixed(1)}</span>
        <span className="">V</span>
      </SingleDetail.Left>
      <SingleDetail.Right>
        <i className="i-bi-lightning-fill text-3xl voltage" />
        Voltage
        {/* <MoreDetail className=" decoration-amber-300">
          {'Max. '}
          {cpu.voltage.max.toFixed(1)}
          {' v'}
        </MoreDetail> */}
        <BulletChart>
          <Bullet options={voltage} />
        </BulletChart>
      </SingleDetail.Right>
    </SingleDetail>
  );
});
