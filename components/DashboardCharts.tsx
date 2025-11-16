"use client";
import React from "react";
import { NormalizedReview } from "@/lib/types";

function averageRatingByListing(reviews: NormalizedReview[]) {
  const map = new Map<string, { sum: number; count: number }>();
  for (const r of reviews) {
    if (r.ratingOverall != null) {
      const key = r.listingId;
      const prev = map.get(key) || { sum: 0, count: 0 };
      map.set(key, { sum: prev.sum + r.ratingOverall, count: prev.count + 1 });
    }
  }
  return Array.from(map.entries()).map(([listingId, { sum, count }]) => ({
    listingId,
    avg: +(sum / count).toFixed(2),
  }));
}

export default function DashboardCharts({ reviews }: { reviews: NormalizedReview[] }) {
  const avgByListing = averageRatingByListing(reviews);

  return (
    <div className="bg-white border rounded p-4">
      <div className="font-medium mb-2">Average rating per property</div>
      <ul className="space-y-1">
        {avgByListing.map(r => (
          <li key={r.listingId} className="flex justify-between text-sm">
            <span className="text-gray-600">{r.listingId}</span>
            <span className="font-medium">{r.avg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
