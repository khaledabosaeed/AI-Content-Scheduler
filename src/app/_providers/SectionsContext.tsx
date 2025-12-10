"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SectionsContextType {
  visibleIndex: number;
  setVisibleIndex: (index: number) => void;
}

const SectionsContext = createContext<SectionsContextType | undefined>(undefined);

export const SectionsProvider = ({ children }: { children: ReactNode }) => {
  const [visibleIndex, setVisibleIndex] = useState(0);

  return (
    <SectionsContext.Provider value={{ visibleIndex, setVisibleIndex }}>
      {children}
    </SectionsContext.Provider>
  );
};

export const useSections = () => {
  const context = useContext(SectionsContext);
  if (!context) throw new Error("useSections must be used within a SectionsProvider");
  return context;
};
