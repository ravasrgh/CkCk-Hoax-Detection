"use client";

import { createContext, useContext, useState, useEffect } from "react";

type SidebarContextType = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const SidebarContext = createContext<SidebarContextType>({
  open: true,
  toggle: () => {},
  close: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  // Persist preference
  useEffect(() => {
    const saved = localStorage.getItem("ckck-sidebar");
    if (saved !== null) setOpen(JSON.parse(saved));
  }, []);

  const toggle = () =>
    setOpen((prev) => {
      localStorage.setItem("ckck-sidebar", JSON.stringify(!prev));
      return !prev;
    });

  const close = () => {
    setOpen(false);
    localStorage.setItem("ckck-sidebar", JSON.stringify(false));
  };

  return (
    <SidebarContext.Provider value={{ open, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
