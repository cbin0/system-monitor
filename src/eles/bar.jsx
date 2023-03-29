import React from 'react';
import { observer } from 'mobx-react-lite';
import settings, { messages } from 'store/settings';
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

export default function B() {
  return (
    <Card className="z-11 relative resize-none w-full flex items-center overflow-visible">
      <Settings />
      <ErrorMessage />
    </Card>
  );
}
