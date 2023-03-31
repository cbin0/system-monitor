import { exit, relaunch } from '@tauri-apps/api/process';
import React, {
  useRef, useContext, useEffect, useState
} from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Popover, RadioGroup } from '@headlessui/react';
import { ThemeContext } from 'contexts/theme';
import settings, { messages } from 'store/settings';
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
        options={[
          ['light', 'light', 'active'],
          ['dark', 'dark', 'bg-stone-8 text-stone-1']
        ]}
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
        options={[[250, '250ms'], [500, '500ms'], [1000, '1s'], [2000, '2s'], [5000, '5s'], [10000, '10s']]}
      />
    </div>
  );
});

const SizeForm = observer(({ className }) => {
  const setWindowSize = useRef((e) => {
    e.preventDefault();
    settings.setWindowSize({
      [e.target.name]: e.target.value
    });
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
                  onChange={setWindowSize.current}
                  className="ml2 px2 py1 b-1 w30"
                  value={settings.windowSize[x]}
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
              onClick={() => { exit(1); }}
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
