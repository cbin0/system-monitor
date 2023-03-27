import React, {} from 'react';
import { observer } from 'mobx-react-lite';
import Bullet from 'charts/bullet';
import { SingleDetail, BulletChart } from './partials';

export default observer(({ cpu, commonOpt }) => {
  // const temp = {
  //   ...commonOpt,
  //   data: [{
  //     id: 'temp.',
  //     ranges: [
  //       0,
  //       0.000001,
  //       30,
  //       60,
  //       70,
  //       80,
  //       90,
  //       95,
  //       100,
  //       105,
  //       110
  //     ],
  //     measures: [
  //       cpu.temperature.value
  //     ],
  //     markers: [
  //       70,
  //       90
  //     ]
  //   }]
  // };

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
          <i className="i-tabler-temperature-celsius" />
        </span>
      </SingleDetail.Left>
      <SingleDetail.Right>
        <i className="i-carbon-temperature-celsius text-3xl temperature" />
        Temp.
        <BulletChart>
          <Bullet options={temp} />
        </BulletChart>
      </SingleDetail.Right>
    </SingleDetail>
  );
});
