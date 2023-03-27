import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Bullet from 'charts/bullet';
import { ThemeContext } from 'contexts/theme';
import { SingleDetail, BulletChart, MoreDetail } from './partials';

export default observer(({ cpu, commonOpt }) => {
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
      max: Math.ceil(cpu.voltage.value),
      colors: [themeVars['percentage-color-4'], themeVars['percentage-color-5']],
      markers: [
        cpu.voltage.max
      ],
      markersTitles: [
        (v) => {
          return `${v.toFixed(1)}`;
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
        <i className="i-bi-lightning-fill text-3xl text-amber-500" />
        Voltage
        <span className="text-base font-semibold">
          <MoreDetail className=" decoration-amber-300">
            Max:
            {' '}
            {cpu.voltage.max}
            v
          </MoreDetail>
        </span>
        <BulletChart>
          <Bullet options={voltage} />
        </BulletChart>
      </SingleDetail.Right>
    </SingleDetail>
  );
});
