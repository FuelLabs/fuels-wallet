import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import type { SidebarLinkItem, DocType } from '../types';

export type DocCtx = { links: SidebarLinkItem[]; doc: DocType };
const ctx = createContext<DocCtx>({} as DocCtx);

export function useDocContext() {
  return useContext(ctx);
}

type DocProviderProps = Partial<DocCtx> & {
  children: ReactNode;
};
export function DocProvider({ children, ...props }: DocProviderProps) {
  return <ctx.Provider value={props as DocCtx}>{children}</ctx.Provider>;
}
