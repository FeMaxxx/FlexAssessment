"use client";
import React from "react";
import { useDashboardStore } from "@/lib/dashboardStore";

export default function Filters() {
  const state = useDashboardStore();
  return (
    <div className="bg-white border rounded-md p-3 flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs text-gray-500">Rating min</label>
        <input
          type="number"
          min={0}
          max={5}
          step={0.1}
          value={state.filters.ratingMin ?? ""}
          onChange={e =>
            state.setFilter("ratingMin", e.target.value === "" ? null : Number(e.target.value))
          }
          className="border rounded px-2 py-1 w-24"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500">Rating max</label>
        <input
          type="number"
          min={0}
          max={5}
          step={0.1}
          value={state.filters.ratingMax ?? ""}
          onChange={e =>
            state.setFilter("ratingMax", e.target.value === "" ? null : Number(e.target.value))
          }
          className="border rounded px-2 py-1 w-24"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500">Channel</label>
        <select
          value={state.filters.channel ?? ""}
          onChange={e => state.setFilter("channel", (e.target.value as any) || null)}
          className="border rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="hostaway">Hostaway</option>
          <option value="google">Google</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500">Category contains</label>
        <input
          value={state.filters.categoryQuery ?? ""}
          onChange={e => state.setFilter("categoryQuery", e.target.value || null)}
          className="border rounded px-2 py-1"
          placeholder="e.g. Cleanliness"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500">Date from</label>
        <input
          type="date"
          value={state.filters.dateFrom ?? ""}
          onChange={e => state.setFilter("dateFrom", e.target.value || null)}
          className="border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500">Date to</label>
        <input
          type="date"
          value={state.filters.dateTo ?? ""}
          onChange={e => state.setFilter("dateTo", e.target.value || null)}
          className="border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500">Sort</label>
        <select
          value={state.sortBy}
          onChange={e => state.setSort(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="newest">Newest</option>
          <option value="highest">Highest rating</option>
          <option value="lowest">Lowest rating</option>
        </select>
      </div>
      <button
        className="ml-auto px-3 py-1.5 border rounded text-sm"
        onClick={() => state.resetFilters()}
      >
        Reset
      </button>
    </div>
  );
}
