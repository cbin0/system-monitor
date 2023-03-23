import React, { useContext, useState, useEffect } from 'react';
import { SysDataContext } from 'contexts/sysdata';
import { SingleDetail, BulletChart, MoreDetail } from './partials';
import Bullet from '../charts/bullet';

export default function A({ commonOpt }) {
  const { cpu } = useContext(SysDataContext);
  const [power, setPower] = useState({});
  useEffect(() => {
    const range = Math.floor(cpu.power.package.max / 4);
    setPower({
      ...commonOpt,
      data: [{
        id: 'power',
        ranges: [
          0,
          0.000001,
          range,
          range * 2,
          range * 3,
          Math.ceil(cpu.power.package.max / 5) * 5
        ],
        measures: [
          cpu.power.package.value,
          cpu.power.cores.value,
          cpu.power.memory.value
        ],
        markers: [
          cpu.power.package.max
        ],
        markersTitles: [
          (v) => { return `${v}`; }
        ]
      }]
    });
  }, [cpu.power.total]);

  return (
    <SingleDetail type="temp">
      <SingleDetail.Left>
        <span className="text-4xl">{cpu.power.package.value.toFixed(0)}</span>
        <span className="">W</span>
      </SingleDetail.Left>
      <SingleDetail.Right>
        <i className="
            i-ic-round-power
            text-3xl text-cyan-500"
        />
        Power
        <MoreDetail className=" decoration-blue-400">
          Memory:
          {' '}
          {cpu.power.memory.value}
          w
        </MoreDetail>
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
}
