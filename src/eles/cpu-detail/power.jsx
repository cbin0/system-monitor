import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { SysDataContext } from 'contexts/sysdata';
import Bullet from 'charts/bullet';
import { SingleDetail, BulletChart, MoreDetail } from './partials';

const { min, log10, ceil } = Math;

export default observer(({ commonOpt }) => {
  const { cpu } = useContext(SysDataContext);
  // const range = Math.floor(cpu.power.package.max / 4);
  // const power = {
  //   ...commonOpt,
  //   data: [{
  //     id: 'power',
  //     ranges: [
  //       0,
  //       0.000001,
  //       range,
  //       range * 2,
  //       range * 3,
  //       Math.ceil(cpu.power.package.max / 5) * 5
  //     ],
  //     measures: [
  //       cpu.power.package.value,
  //       cpu.power.cores.value,
  //       cpu.power.memory.value
  //     ],
  //     markers: [
  //       cpu.power.package.max
  //     ],
  //     markersTitles: [
  //       (v) => { return `${v}`; }
  //     ]
  //   }]
  // };

  const power = {
    ...commonOpt,
    data: {
      value: cpu.power.package.value,
      max: cpu.power.package.max
        + (min(1, ceil(log10(cpu.power.package.max)) - 1)) * 10,
      markers: [
        cpu.power.package.max
      ],
      markersTitles: [
        (v) => { return `${v}`; }
      ]
    }
  };

  return (
    <SingleDetail type="temp">
      <SingleDetail.Left>
        <span className="text-4xl">{cpu.power.package.value.toFixed(0)}</span>
        <span className="">W</span>
      </SingleDetail.Left>
      <SingleDetail.Right>
        <i className="
            i-ic-round-power
            text-3xl power"
        />
        Power
        {/* <MoreDetail className=" decoration-blue-400">
          Memory:
          {' '}
          {cpu.power.memory.value}
          w
        </MoreDetail> */}
        <MoreDetail className=" decoration-indigo-400">
          Cores:
          {' '}
          {cpu.power.cores.value}
          w
        </MoreDetail>
        <BulletChart>
          <Bullet options={power} />
        </BulletChart>
      </SingleDetail.Right>
    </SingleDetail>
  );
});
