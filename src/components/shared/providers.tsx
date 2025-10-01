'use client';

import { ReactNode } from 'react';
import SmoothScroll from './smooth-scroll';
import { Cursor } from './cursor';
import { ContextProvider } from '../../context/context';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SmoothScroll>
        <ContextProvider>
          {/* <Cursor /> */}
          {children}
        </ContextProvider>
      </SmoothScroll>
    </>
  );
};
