import { ConsolidateCoinsMachineCtx } from '../../context/consolidateCoinsCtx';

interface ConsolidateCoinsProviderProps {
  children: React.ReactNode;
}

export function ConsolidateCoinsProvider({
  children,
}: ConsolidateCoinsProviderProps) {
  return (
    <ConsolidateCoinsMachineCtx.Provider>
      {children}
    </ConsolidateCoinsMachineCtx.Provider>
  );
}
