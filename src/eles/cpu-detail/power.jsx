import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { SysDataContext } from 'contexts/sysdata';
import Bullet from 'charts/bullet';
import { SingleDetail, BulletChart, MoreDetail } from './partials';

const { min, log10, ceil } = Math;

export default observer(({ commonOpt }) => {
  const { cpu } = useContext(SysDataContext);
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
        CPU Power
        {/* <MoreDetail className=" decoration-blue-400">
          Memory:
          {' '}
          {cpu.power.memory.value}
          w
        </MoreDetail> */}
        { cpu.power.cores.value > 0 && (
          <MoreDetail className=" decoration-indigo-400">
            {'Cores. '}
            {cpu.power.cores.value}
            {' w'}
          </MoreDetail>
        )}
        <BulletChart>
          <Bullet options={power} />
        </BulletChart>
      </SingleDetail.Right>
    </SingleDetail>
  );
});
