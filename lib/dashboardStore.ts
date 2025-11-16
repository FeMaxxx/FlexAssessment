"use client";
import { create } from "zustand";
import { NormalizedReview } from "./types";

interface Filters {
  ratingMin: number | null;
  ratingMax: number | null;
  channel: "hostaway" | "google" | null;
  categoryQuery: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  listingId: string | null;
}

type SortBy = "newest" | "highest" | "lowest";

interface DashboardState {
  filters: Filters;
  sortBy: SortBy;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setListing: (listingId: string | null) => void;
  resetFilters: () => void;
  setSort: (s: SortBy) => void;
  apply: (reviews: NormalizedReview[]) => NormalizedReview[];
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  filters: {
    ratingMin: null,
    ratingMax: null,
    channel: null,
    categoryQuery: null,
    dateFrom: null,
    dateTo: null,
    listingId: null,
  },
  sortBy: "newest",
  setFilter: (key, value) => set(s => ({ filters: { ...s.filters, [key]: value } })),
  setListing: listingId => set(s => ({ filters: { ...s.filters, listingId } })),
  resetFilters: () =>
    set({
      filters: {
        ratingMin: null,
        ratingMax: null,
        channel: null,
        categoryQuery: null,
        dateFrom: null,
        dateTo: null,
        listingId: null,
      },
      sortBy: "newest",
    }),
  setSort: s => set({ sortBy: s }),
  apply: reviews => {
    const { filters, sortBy } = get();
    let out = [...reviews];
    if (filters.listingId) out = out.filter(r => r.listingId === filters.listingId);
    if (filters.channel) out = out.filter(r => r.channel === filters.channel);
    if (filters.ratingMin != null)
      out = out.filter(r => (r.ratingOverall ?? 0) >= filters.ratingMin!);
    if (filters.ratingMax != null)
      out = out.filter(r => (r.ratingOverall ?? 0) <= filters.ratingMax!);
    if (filters.categoryQuery)
      out = out.filter(r =>
        r.categories.some(c => c.name.toLowerCase().includes(filters.categoryQuery!.toLowerCase()))
      );
    if (filters.dateFrom)
      out = out.filter(r => new Date(r.submittedAt) >= new Date(filters.dateFrom!));
    if (filters.dateTo) out = out.filter(r => new Date(r.submittedAt) <= new Date(filters.dateTo!));

    out.sort((a, b) => {
      if (sortBy === "newest") return +new Date(b.submittedAt) - +new Date(a.submittedAt);
      if (sortBy === "highest") return (b.ratingOverall ?? 0) - (a.ratingOverall ?? 0);
      return (a.ratingOverall ?? 0) - (b.ratingOverall ?? 0);
    });
    return out;
  },
}));
