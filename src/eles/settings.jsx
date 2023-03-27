import { appWindow, PhysicalSize } from '@tauri-apps/api/window';
import { exit, relaunch } from '@tauri-apps/api/process';
import React, {
  Fragment, useRef, useContext, useEffect, useState
} from 'react';
import { observer } from 'mobx-react-lite';
import { Popover, RadioGroup, Transition } from '@headlessui/react';
import { ThemeContext } from 'contexts/theme';

const transition = {
  enter: 'transition ease-out duration-100',
  enterFrom: 'transform opacity-0 scale-95',
  enterTo: 'transform opacity-100 scale-100',
  leave: 'transition ease-in duration-75',
  leaveFrom: 'transform opacity-100 scale-100',
  leaveTo: 'transform opacity-0 scale-95'
};

const themes = [
  ['light', 'light', 'bg-sky-5 text-stone-1'],
  ['dark', 'dark', 'bg-stone-8 text-stone-1']
];

function SizeForm({ className }) {
  const iw = useRef(null);
  const ih = useRef(null);
  const setSize = ({ width, height }) => {
    iw.current.value = width;
    ih.current.value = height;
  };
  const getSize = () => {
    return appWindow.innerSize().then(setSize);
  };
  const setWindowSize = (e, ...p) => {
    e.preventDefault();
    appWindow.setSize(new PhysicalSize(
      Math.min(+iw.current.value, 10000),
      Math.min(+ih.current.value, 5000)
    )).then(getSize);
  };
  useEffect(() => {
    let unListen = () => {};
    getSize();
    appWindow.onResized(setSize).then((x) => { unListen = x; });
    return () => { unListen(); };
  }, []);
  return (
    <div className={`p4 ${className || ''}`}>
      <form className="flex items-end gap4" onSubmit={setWindowSize}>
        <div>
          Width:
          <input ref={iw} type="number" className="px-2 py-1 b-1 w30" />
        </div>
        <div className="">
          Height:
          <input ref={ih} type="number" className="px-2 py-1 b-1 w30" />
        </div>
        <div className="">
          <button type="submit" className="button whitespace-nowrap">Confirm</button>
        </div>
      </form>
    </div>
  );
}

export default observer(() => {
  const theme = useContext(ThemeContext);
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
      <Transition as={Fragment} {...transition}>
        <Popover.Panel className="rounded-lg shadow-lg bg-white absolute left-1 z-10 mt-3 text-stone-800 max-w-sm px-4 sm:px-0 lg:max-w-3xl">
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
                          relative flex cursor-pointer rounded-lg px-3 py-2
                          shadow-md focus:outline-none
                          ${checked ? x[2] : 'bg-stone-3'}`;
                      }}
                    >
                      {({ active, checked }) => {
                        return (
                          <div className="whitespace-nowrap">
                            {checked && (
                            <span className="mr-2">
                              <i className="i-bi-check-circle-fill" />
                            </span>
                            )}
                            {x[1]}
                          </div>
                        );
                      }}
                    </RadioGroup.Option>
                  );
                })}
              </div>
            </RadioGroup>
          </div>
          <SizeForm className="p4 b-t-1" />
          <div className="p4 b-t-1 flex flex-row-reverse gap4">
            <a
              href="##"
              className="button-danger"
              onClick={() => { exit(1); }}
            >
              <i className="i-ic-baseline-cancel text-xl align-text-bottom mr1" />
              Quit
            </a>
            <a
              href="##"
              className="button"
              onClick={() => { relaunch(); }}
            >
              <i className="i-ic-baseline-refresh text-xl align-text-bottom mr1" />
              ReLaunch
            </a>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
});
