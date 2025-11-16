"use client";
import React from "react";
import { NormalizedReview } from "@/lib/types";
import clsx from "clsx";

export default function SidebarProperties({
  reviews,
  selected,
  onSelect,
}: {
  reviews: NormalizedReview[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const groups = reviews.reduce<Record<string, number>>((acc, r) => {
    acc[r.listingId] = (acc[r.listingId] || 0) + 1;
    return acc;
  }, {});
  const listingIds = Object.keys(groups).sort();

  return (
    <aside className="w-64 shrink-0 border-r bg-white hidden md:block">
      <div className="p-4">
        <div className="text-xs uppercase text-gray-500 mb-2">Properties</div>
        <button
          className={clsx(
            "w-full text-left px-3 py-2 rounded hover:bg-gray-100",
            !selected && "bg-gray-100"
          )}
          onClick={() => onSelect(null)}
        >
          All properties
        </button>
        <ul className="mt-2 space-y-1">
          {listingIds.map(id => (
            <li key={id}>
              <button
                className={clsx(
                  "w-full text-left px-3 py-2 rounded hover:bg-gray-100",
                  selected === id && "bg-gray-100"
                )}
                onClick={() => onSelect(id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{id}</span>
                  <span className="text-xs text-gray-500">{groups[id]}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
