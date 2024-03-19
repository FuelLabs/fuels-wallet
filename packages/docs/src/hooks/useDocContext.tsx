import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { DocType, SidebarLinkItem } from '~/src/types';

export type DocCtx = {
  doc: DocType;
  docLink: SidebarLinkItem;
  links: SidebarLinkItem[];
};
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
