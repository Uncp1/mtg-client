import { createContext, type ReactNode, useContext, useState } from 'react';
import type { InstanceId } from '@mtg/game-core';

//todo пока делаем через контекст, тк с редаксом гемор что у него рут в другом модуле
const InspectorContext = createContext<{
  inspectedId: InstanceId | null;
  inspect: (id: InstanceId) => void;
} | null>(null);

export const useCardInspector = () => {
  const context = useContext(InspectorContext);

  if (!context) throw new Error('useCardInspector вне CardInspectorProvider');

  return context;
};

export function CardInspectorProvider({ children }: { children: ReactNode }) {
  const [inspectedId, setInspectedId] = useState<InstanceId | null>(null);
  return (
    <InspectorContext.Provider value={{ inspectedId, inspect: setInspectedId }}>
      {children}
    </InspectorContext.Provider>
  );
}
