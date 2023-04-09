import React, {
  useRef, useContext
} from 'react';
import { exit, relaunch } from '@tauri-apps/api/process';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Popover } from '@headlessui/react';
import { ThemeContext } from 'contexts/theme';
import settings, { themes, intervals, messages } from 'store/settings';
import { Transition, Radios } from 'eles/comps';
import DataSource from './datasource';

const ThemeForm = observer(() => {
  const theme = useContext(ThemeContext);
  return (
    <div className="p4 flex gap4">
      <Radios
        className="flex-1"
        value={theme.themeName}
        onChange={(v) => {
          theme.themeName = v;
        }}
        options={Object.keys(themes).map((x) => { return [x, themes[x], x === 'dark' ? 'bg-stone-8 text-stone-1' : 'active']; })}
      />
    </div>
  );
});

const ChangeInterval = observer(({ className }) => {
  return (
    <div className="p4 flex gap4 b-t">
      <div>interval: </div>
      <Radios
        className="flex-1"
        value={settings.interval}
        onChange={action((v) => {
          settings.interval = v;
          messages.push({
            id: 'interval changed',
            type: 'warn',
            title: 'Tip',
            message: `Don't forget to update the interval of ${settings.ds.name}`
          });
        })}
        options={Object.keys(intervals).map((x) => { return [+x, intervals[x]]; })}
      />
    </div>
  );
});

const SizeForm = observer(({ className }) => {
  const setWindow = useRef((e) => {
    e.preventDefault();
    settings.setWindow({
      [e.target.name]: e.target.value
    });
    settings.applySize();
  });

  return (
    <div className="p4 b-t">
      <div className="flex items-end gap4">
        {
          ['width', 'height'].map((x) => {
            return (
              <div key={x}>
                {x}
                :
                <input
                  type="number"
                  name={x}
                  onChange={setWindow.current}
                  className="ml2 px2 py1 b-1 w30"
                  value={settings.window[x]}
                />
              </div>
            );
          })
        }
      </div>
    </div>
  );
});

export default function S() {
  return (
    <Popover className="z-11 relative">
      <Popover.Button className="">
        {({ open }) => {
          return (
            <div className={`cxy-center rounded-full p4 ${open && 'opacity-50'}`}>
              <i className="text-2xl i-bi-gear-fill" />
            </div>
          );
        }}
      </Popover.Button>
      <Transition>
        <Popover.Panel className="rounded-lg shadow-lg bg-white
          absolute left-1 z-10 mt-3 text-stone-800 max-w-md
          lg:w-xl"
        >
          <ThemeForm />
          <ChangeInterval />
          <SizeForm />
          <DataSource />
          <div className="p4 b-t-1 flex flex-row-reverse gap4">
            <a
              href="##"
              className="btn-danger"
              onClick={() => { exit(0); }}
            >
              <i className="i-ic-baseline-cancel text-xl mr1" />
              Quit
            </a>
            <a
              href="##"
              className="btn"
              onClick={() => { relaunch(); }}
            >
              <i className="i-ic-baseline-refresh text-xl mr1" />
              ReLaunch
            </a>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
