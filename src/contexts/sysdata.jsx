import React, {
  createContext
} from 'react';
import sysData from 'store/sysdata';

export const SysDataContext = createContext(sysData);

export function SysDataProvider({ children }) {
  return (
    <SysDataContext.Provider value={sysData}>
      {children}
    </SysDataContext.Provider>
  );
}
