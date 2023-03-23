import React, { useContext, useState, useEffect } from 'react';
import { SysDataContext } from '../../contexts/sysdata.jsx';
import { SingleDetail, BulletChart } from './partials.jsx';
import Bullet from '../charts/bullet.jsx';

export default function A({ commonOpt }) {
  const { cpu } = useContext(SysDataContext);
  const [temp, setTemp] = useState({});
  useEffect(() => {
    setTemp({
      ...commonOpt,
      data: [{
        id: 'temp.',
        ranges: [
          0,
          0.000001,
          30,
          60,
          70,
          80,
          90,
          95,
          100,
          105,
          110
        ],
        measures: [
          cpu.temperature
        ],
        markers: [
          70,
          90
        ]
      }]
    });
  }, [cpu.temperature]);

  return (
    <SingleDetail type="temp">
      <SingleDetail.Left>
        <span className="text-4xl">
          {cpu.temperature}
          <i className="i-tabler-temperature-celsius" />
        </span>
      </SingleDetail.Left>
      <SingleDetail.Right>
        <i className="i-carbon-temperature-celsius text-3xl text-fuchsia-400" />
        Temp.
        <BulletChart>
          <Bullet options={temp} />
        </BulletChart>
      </SingleDetail.Right>
    </SingleDetail>
  );
}
