import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { darken, lighten, transparentize } from 'color2k';
import { SysDataContext } from 'contexts/sysdata';
import { ThemeContext } from 'contexts/theme';
import Bullet from './charts/bullet';

function Detail({ children, type, data }) {
  const { themeVars } = useContext(ThemeContext);
  const c = transparentize(themeVars[`${type}-color`], 0.25);
  return (
    <div className="basis-8 flex items-center">
      <div
        className="py-2 w-26 my[2px] mr4 text-stone-200 text-xl cxy-center"
        style={{
          borderLeft: `5px solid ${darken(c, 0.2)}`,
          background: c
        }}
      >
        <span className="mr1">
          {data.value.toFixed(1)}
        </span>
        {children}
      </div>
      <Bullet className="flex-1" options={{ data, rounded: '0' }} />
    </div>
  );
}

export default observer(() => {
  const { gpu } = useContext(SysDataContext);
  const c1 = transparentize('#bbb', 0.7);
  const c2 = darken(c1, 0.2);
  return (
    <div
      className="
        p4 pt-[85px] m4 mt-[-90px] gap4 flex flex-col
        rounded-t-[10px] rounded-b-[5px]
      "
      style={{
        background: `linear-gradient(to bottom, ${c1}, ${c2})`
      }}
    >
      <Detail
        type="temperature"
        data={{
          value: gpu.temperature.value,
          max: 100
        }}
      >
        <i className="i-tabler-temperature-celsius" />
      </Detail>
      <Detail
        type="power"
        data={{
          value: gpu.power.package.value,
          max: gpu.power.package.max
        }}
      >
        W
      </Detail>
      <Detail
        type="memory"
        data={{
          value: gpu.ram.used.value,
          max: gpu.ram.total.value
        }}
      >
        GB
      </Detail>
    </div>
  );
});
