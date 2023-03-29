import { exit, relaunch } from '@tauri-apps/api/process';
import React, {
  useRef, useContext, useEffect, useState
} from 'react';
import { observer } from 'mobx-react-lite';
import { Popover, RadioGroup } from '@headlessui/react';
import { ThemeContext } from 'contexts/theme';
import settings, { } from 'store/settings';
import { Transition } from 'eles/comps';
import DataSource from './datasource';

const themes = [
  ['light', 'light', 'active shadow-none'],
  ['dark', 'dark', 'bg-stone-8 text-stone-1 b-stone-8 shadow-none']
];

const ThemeForm = observer(() => {
  const theme = useContext(ThemeContext);
  return (
    <div className="flex overflow-hidden">
      <RadioGroup
        value={theme.themeName}
        onChange={(v) => {
          theme.themeName = v;
        }}
      >
        {/* <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label> */}
        <div className="p-4 gap-4 flex">
          {themes.map((x) => {
            return (
              <RadioGroup.Option
                key={x[0]}
                value={x[0]}
                className={({ active, checked }) => {
                  return `
                    relative flex cursor-pointer rounded-lg b-1 b-stone-3 px3 py1
                    shadow-md focus:outline-none
                    ${checked ? x[2] : 'bg-stone-1'}`;
                }}
              >
                {({ active, checked }) => {
                  return (
                    <div className="flex items-center">
                      {checked && (
                      <i className="i-ic-baseline-check text-xl mr-2" />
                      )}
                      <span>{x[1]}</span>
                    </div>
                  );
                }}
              </RadioGroup.Option>
            );
          })}
        </div>
      </RadioGroup>
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
    <div className="p4 b-t-1">
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
