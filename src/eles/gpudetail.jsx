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
      {/* <div className={`h-[100%] ${type}`} /> */}
      <div
        className="py-2 w-26 mr2 rounded-md text-stone-200 text-lg cxy-center"
        style={{
          borderLeft: `5px solid ${darken(c, 0.2)}`,
          background: c
        }}
      >
        <span className="mr1">
          {data.value}
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
  const c2 = darken(c1, 0.4);
  return (
    <div
      className="
        p4 pt-[100px] m4 mt-[-90px] gap4 flex flex-col
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
        type="voltage"
        data={{
          value: gpu.voltage.value,
          max: gpu.voltage.max
        }}
      >
        V
      </Detail>
    </div>
  );
});
