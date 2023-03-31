import React, {
  createContext
} from 'react';
import BaseResolver from 'resolvers/base';

const resolver = new BaseResolver();

export const ResolverContext = createContext(resolver);

export function ResolverProvider({ children }) {
  return (
    <ResolverContext.Provider value={resolver}>
      {children}
    </ResolverContext.Provider>
  );
}
