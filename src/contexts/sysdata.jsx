import React, {
  createContext, useEffect, useRef
} from 'react';
import sysData from 'store/sysdata';
import resolvers from 'resolvers';
import settings, { messages } from 'store/settings';

export const SysDataContext = createContext(sysData);

export function SysDataProvider({ children }) {
  const resolver = useRef(null);
  const stop = () => { return resolver.current && resolver.current.stop(); };
  useEffect(() => {
    if (!resolvers[settings.ds.id]) {
      messages.push({
        id: 'no resolver',
        type: 'error',
        title: 'Can not find resolver',
        message: `${settings.ds.name} does not have a available resolver,
          please choose other one`
      });
    } else {
      stop();
      resolver.current = new resolvers[settings.ds.id]();
    }
    return stop;
  }, [settings.ds.id]);

  return (
    <SysDataContext.Provider value={sysData}>
      {children}
    </SysDataContext.Provider>
  );
}
