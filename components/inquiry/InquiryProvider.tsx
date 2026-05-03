"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import type { InquiryItem } from "@/lib/types";

type InquiryState = {
  items: InquiryItem[];
  count: number;          // total qty across all items
  uniqueCount: number;    // distinct SKUs
  hydrated: boolean;
  drawerOpen: boolean;

  add: (item: InquiryItem) => void;
  setQty: (sku: string, qty: number) => void;
  setNote: (sku: string, note: string) => void;
  toggleCustomisation: (sku: string) => void;
  remove: (sku: string) => void;
  clear: () => void;

  openDrawer: () => void;
  closeDrawer: () => void;
};

const Ctx = createContext<InquiryState | null>(null);
const STORAGE_KEY = "zhuoheng:inquiry:v1";

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  const add = useCallback((item: InquiryItem) => {
    setItems((prev) => {
      const found = prev.find((i) => i.sku === item.sku);
      if (found) {
        return prev.map((i) =>
          i.sku === item.sku ? { ...i, qty: i.qty + item.qty } : i,
        );
      }
      return [...prev, item];
    });
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((sku: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.sku !== sku)
        : prev.map((i) => (i.sku === sku ? { ...i, qty } : i)),
    );
  }, []);

  const setNote = useCallback((sku: string, note: string) => {
    setItems((prev) =>
      prev.map((i) => (i.sku === sku ? { ...i, note } : i)),
    );
  }, []);

  const toggleCustomisation = useCallback((sku: string) => {
    setItems((prev) =>
      prev.map((i) => (i.sku === sku ? { ...i, customisation: !i.customisation } : i)),
    );
  }, []);

  const remove = useCallback((sku: string) => {
    setItems((prev) => prev.filter((i) => i.sku !== sku));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const uniqueCount = items.length;

  const value = useMemo<InquiryState>(() => ({
    items, count, uniqueCount, hydrated, drawerOpen,
    add, setQty, setNote, toggleCustomisation, remove, clear,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  }), [items, count, uniqueCount, hydrated, drawerOpen,
       add, setQty, setNote, toggleCustomisation, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useInquiry() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useInquiry must be used inside <InquiryProvider>");
  return ctx;
}
