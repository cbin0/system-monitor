import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { SysDataContext } from 'contexts/sysdata';
import Bullet from 'charts/bullet';
import { SingleDetail, BulletChart } from './partials';

export default observer(({ commonOpt }) => {
  const { cpu } = useContext(SysDataContext);
  const temp = {
    ...commonOpt,
    data: {
      value: cpu.temperature.value,
      max: 110,
      markers: [
        70,
        90
      ]
    }
  };

  return (
    <SingleDetail type="temp">
      <SingleDetail.Left>
        <span className="text-4xl">
          {cpu.temperature.value}
        </span>
        <i className="text-3xl i-tabler-temperature-celsius" />
      </SingleDetail.Left>
      <SingleDetail.Right>
        <i className="i-carbon-temperature-celsius text-3xl temperature" />
        CPU Temp.
        <BulletChart>
          <Bullet options={temp} />
        </BulletChart>
      </SingleDetail.Right>
    </SingleDetail>
  );
});
