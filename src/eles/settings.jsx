import React, {
  Fragment, useEffect, useContext, useState
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
          <div className="flex overflow-hidden space-y-2 ring-1 ring-black ring-opacity-5">
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
          <div className="p4">
            <a
              href="##"
              className="block px4 py2 b-r-1 rounded-lg divide-y hover:bg-sky-5 hover:text-stone-1"
              onClick={() => { document.location.reload(); }}
            >
              <i className="i-ic-baseline-refresh text-xl align-text-bottom mr1" />
              Refresh
            </a>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
});
