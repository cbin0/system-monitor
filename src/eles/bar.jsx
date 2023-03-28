import React from 'react';
import { Transition } from '@headlessui/react';
import { observer } from 'mobx-react-lite';
import { Card } from './comps';
import Settings from './settings';
import settings, { messages, transition } from 'store/settings';

function getMsIcon(t) {
  switch(t) {
    case 'error': return "i-mdi-close-circle";
    case 'warn': return "i-mdi-information";
    case 'success': return "i-mdi-check-circle";
    default: return null;
  }
}

const ErrorMessage = observer(() => {
  return <Transition show={!!messages.data.length} as={React.Fragment} {...transition}>
    <div className='absolute top-full left-[2%] right-[2%] rounded-b-2 overflow-hidden'>
      {messages.data.map(({type, title, message}, i) => (
        <div key={i} className={`p2 flex message-${type}`}>
          <div className='p1'>
            <i className={`${getMsIcon(type)} text-3xl`} />
          </div>
          <div className='py1 px2 flex-1'>
            <div className='text-2xl'>{title}</div>
            <div className='text-lg'>{message}</div>
          </div>
        </div>
      ))}
    </div>
  </Transition>;
});

export default function B() {
  return (
    <Card className="z-11 relative resize-none w-full flex items-center overflow-visible">
      <Settings />
      <ErrorMessage />
    </Card>
  );
};
