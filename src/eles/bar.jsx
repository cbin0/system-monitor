import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { appWindow } from '@tauri-apps/api/window';
import { exit } from '@tauri-apps/api/process';
import settings, { messages } from 'store/settings';
import { ResolverProvider } from 'contexts/resolver';
import { SysDataContext } from 'contexts/sysdata';
import { Card, Transition } from './comps';
import Settings from './settings';

function getMsIcon(t) {
  switch (t) {
    case 'error': return 'i-mdi-close-circle';
    case 'warn': return 'i-mdi-information';
    case 'success': return 'i-mdi-check-circle';
    default: return null;
  }
}

function WindowOpt() {
  return (
    <div className="flex p1 gap1 items-stretch">
      <button
        type="button"
        onClick={() => { appWindow.toggleMaximize(); }}
        className="flex px3 cxy-center hover:bg-orange-4/80 hover:text-stone-1 rounded-md"
      >
        <i className="i-tabler-maximize text-3xl" />
      </button>
      <button
        type="button"
        onClick={() => { exit(0); }}
        className="flex px3 cxy-center hover:bg-rose-6/80 hover:text-stone-1 rounded-md"
      >
        <i className="i-mdi-window-close text-3xl" />
      </button>
    </div>
  );
}

const ErrorMessage = observer(() => {
  return (
    <Transition show={!!messages.data.length}>
      <div className="absolute top-[120%] left-[60%] right-[1%] rounded-2 overflow-hidden">
        {messages.data.map(({
          id, type, title, message
        }) => {
          return (
            <div key={id} className={`p2 flex message-${type}`}>
              <div className="p1">
                <i className={`${getMsIcon(type)} text-3xl`} />
              </div>
              <div className="py1 px2 flex-1">
                <div className="text-2xl">{title}</div>
                <div className="text-lg">{message}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Transition>
  );
});

const BaseInfo = observer(() => {
  const sysData = useContext(SysDataContext);
  return (
    <button
      type="button"
      onMouseDown={() => { appWindow.startDragging(); }}
      className="flex-1 flex items-center cursor-move"
    >
      <div>{sysData.name}</div>
      {/* <div>
        {'processes: '}
        {sysData.processes.count}
      </div> */}
    </button>
  );
});

export default function B() {
  return (
    <ResolverProvider>
      <Card className="z-11 relative resize-none w-full flex items-stretch gap4 overflow-visible">
        <Settings />
        <BaseInfo />
        <WindowOpt />
        <ErrorMessage />
      </Card>
    </ResolverProvider>
  );
}
