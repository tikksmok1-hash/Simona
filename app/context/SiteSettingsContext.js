'use client';

import { createContext, useContext } from 'react';

const SiteSettingsContext = createContext({});

export function SiteSettingsProvider({ value, children }) {
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
