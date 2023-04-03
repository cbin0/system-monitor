import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Bullet from 'charts/bullet';
import { SysDataContext } from 'contexts/sysdata';
import { ThemeContext } from 'contexts/theme';
import { SingleDetail, BulletChart, MoreDetail } from './partials';

export default observer(({ commonOpt }) => {
  const { ram } = useContext(SysDataContext);
  const { themeVars } = useContext(ThemeContext);
  const v = (ram.used.value / 1024).toFixed(1);
  const a = (ram.available.value / 1024).toFixed(1);
  const total = Math.round((ram.used.value + ram.available.value) / 1024);
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
        <span className="text-4xl">{v}</span>
        <span className="">GB</span>
      </SingleDetail.Left>
      <SingleDetail.Right>
        <i className="i-material-symbols-memory-alt-rounded text-3xl memory" />
        Memory
        <span className="text-base font-semibold">
          <MoreDetail className=" decoration-rose-400">
            {'All. '}
            {total}
            {' GB'}
          </MoreDetail>
          <MoreDetail className=" decoration-rose-400">
            {'free. '}
            {a}
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
