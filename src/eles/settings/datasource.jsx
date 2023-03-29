import React, { useRef } from 'react';
import { Listbox } from '@headlessui/react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import settings, { datasources } from 'store/settings';
import { Transition } from 'eles/comps';

export default observer(({ className }) => {
  const deferedChangeConfig = useRef(action((id, value) => {
    let re = value;
    switch (settings.ds.config[id].type) {
      case 'number': re = parseInt(re, 10); break;
      default: break;
    }
    settings.ds.config[id].value = re;
  }));

  const configChanged = (e) => {
    e.preventDefault();
    deferedChangeConfig.current(e.target.name, e.target.value);
  };

  return (
    <div className="p4 b-t-1 bg-stone-2">
      <Listbox value={settings.ds.name} onChange={() => {}}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{settings.ds.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <i className="h5 w5 text-gray-400 i-ph-caret-up-down" />
            </span>
          </Listbox.Button>
          <Transition>
            <Listbox.Options className="
              absolute mt1 max-h-60 w-full overflow-auto rounded-md
            bg-white py1 text-base shadow-lg
              ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {Object.keys(datasources).map((k) => {
                const ds = datasources[k];
                return (
                  <Listbox.Option
                    key={k}
                    className={({ active }) => {
                      return `relative cursor-default select-none py2 pl10 pr4 ${
                        active ? 'active' : 'text-gray-900'
                      }`;
                    }}
                    value={ds.name}
                  >
                    {({ selected }) => {
                      return (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {ds.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <i className="i-ic-baseline-check text-xl" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      );
                    }}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <div className="b-stone-3 pt2 ml2 b-l-1 flex flex-col gap4">
        {
          settings.ds.config && Object.keys(settings.ds.config).map((id) => {
            const {
              name, value, unit, type
            } = settings.ds.config[id];
            return (
              <div key={id} className="b-color-inherit pl4 b-b-1 pb4">
                <span>
                  {name}
                  :
                </span>
                <div className="mt2">
                  <input
                    className="b-1 b-stone-3 mr2 py-1 px-2"
                    type={type}
                    name={id}
                    value={value}
                    onChange={configChanged}
                  />
                  <span>{unit || ''}</span>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
});
