"use client";
import React, { useState } from "react";
import { NormalizedReview } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Star } from "lucide-react";

export default function ReviewCard({
  review,
  onToggle,
}: {
  review: NormalizedReview;
  onToggle: (id: number, approve: boolean) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const approve = async () => {
    setLoading(true);
    try {
      await onToggle(review.id, !review.approvedForWebsite);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{review.channel.toUpperCase()}</span>
            <span className="text-xs text-gray-400">{formatDate(review.submittedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={
                  "h-4 w-4 " +
                  (i < Math.round(review.ratingOverall || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300")
                }
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">{review.ratingOverall ?? "N/A"}</span>
          </div>
          <div className="text-sm text-gray-700">
            {review.text || <em>No comment provided.</em>}
          </div>
          <div className="text-xs text-gray-500">— {review.guestName}</div>
          <div className="flex gap-2 flex-wrap">
            {review.categories.map(c => (
              <span key={c.name} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                {c.name}: {c.rating}
              </span>
            ))}
          </div>
        </div>
        <div>
          <button
            className={`px-3 py-1.5 rounded text-sm border ${
              review.approvedForWebsite
                ? "bg-green-50 border-green-600 text-green-700"
                : "bg-white border-gray-300 text-gray-700"
            } disabled:opacity-50`}
            onClick={approve}
            disabled={loading}
            aria-busy={loading}
          >
            {review.approvedForWebsite ? "Unapprove" : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
