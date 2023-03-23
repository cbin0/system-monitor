import React, { useContext, useState, useEffect } from 'react';
import { SysDataContext } from '../../contexts/sysdata.jsx';
import { SingleDetail, BulletChart, MoreDetail } from './partials.jsx';
import Bullet from '../charts/bullet.jsx';

export default function A({ commonOpt }) {
  const { cpu } = useContext(SysDataContext);
  const [voltage, setVoltage] = useState({});
  useEffect(() => {
    const range = Math.ceil(cpu.voltage.value) / 4;
    setVoltage({
      ...commonOpt,
      data: [{
        id: 'voltage',
        ranges: [
          0,
          0.000001,
          range,
          range * 2,
          range * 3,
          range * 4
        ],
        measures: [
          cpu.voltage.value
        ],
        markers: [
          cpu.voltage.max
        ],
        markersTitles: [
          (v) => {
            return `${v.toFixed(1)}`;
          }
        ]
      }]
    });
  }, [cpu.voltage.value]);

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
}
