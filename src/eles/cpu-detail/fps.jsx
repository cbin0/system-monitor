import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { SysDataContext } from 'contexts/sysdata';
import { ThemeContext } from 'contexts/theme';
import settings from 'store/settings';

export default observer(() => {
  if (settings.ds.id !== 'msiAB') return null;
  const { classNames } = useContext(ThemeContext);
  const { frame } = useContext(SysDataContext);
  const divide = <div className={classNames.fpsDivide} />;
  return (
    <div className={`${classNames.fps}`}>
      <div className="">
        <span className="text-4xl">
          {frame.framerate.toFixed(0)}
        </span>
        <span className="ml2">
          FPS
        </span>
      </div>
      {divide}
      <div>
        <span className="">
          {frame.frametime.toFixed(1)}
        </span>
        <span className="">
          ms
        </span>
      </div>
      {divide}
      <div>
        <span className="">
          {frame['1%low'].toFixed(0)}
        </span>
        <span className="">
          /1%low
        </span>
      </div>
      {divide}
      <div>
        <span className="">
          {frame['0.1%low'].toFixed(0)}
        </span>
        <span className="">
          /0.1%low
        </span>
      </div>
    </div>
  );
});
