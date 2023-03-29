import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Bullet from 'charts/bullet';
import { SysDataContext } from 'contexts/sysdata';
import { ThemeContext } from 'contexts/theme';
import { SingleDetail, BulletChart, MoreDetail } from './partials';

export default observer(({ commonOpt }) => {
  const { ram } = useContext(SysDataContext);
  const { themeVars } = useContext(ThemeContext);
  const opt = {
    ...commonOpt,
    data: {
      value: ram.usage.value,
      max: 100,
      markers: [
        // ram.virtual.usage.value
      ],
      markersTitles: [
        // (v) => {
        //   return `${v.toFixed(1)}`;
        // }
      ]
    }
  };

  return (
    <SingleDetail type="temp">
      <SingleDetail.Left>
        <span className="text-4xl">{ram.used.value.toFixed(1)}</span>
        <span className="">GB</span>
      </SingleDetail.Left>
      <SingleDetail.Right>
        <i className="i-material-symbols-memory-alt-rounded text-3xl memory" />
        Memory
        <span className="text-base font-semibold">
          <MoreDetail className=" decoration-rose-400">
            {'All. '}
            {(ram.used.value + ram.available.value).toFixed(1)}
            {' GB'}
          </MoreDetail>
          <MoreDetail className=" decoration-rose-400">
            {'free. '}
            {ram.available.value.toFixed(1)}
            {' GB'}
          </MoreDetail>
        </span>
        <BulletChart>
          <Bullet options={opt} />
        </BulletChart>
      </SingleDetail.Right>
    </SingleDetail>
  );
});
