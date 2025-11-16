"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NormalizedReview } from "@/lib/types";
import { useDashboardStore } from "@/lib/dashboardStore";
import SidebarProperties from "./SidebarProperties";
import Filters from "./Filters";
import DashboardCharts from "./DashboardCharts";
import ReviewCard from "./ReviewCard";

function ReviewsList({
  reviews,
  onToggle,
}: {
  reviews: NormalizedReview[];
  onToggle: (id: number, approve: boolean) => Promise<void>;
}) {
  return (
    <div className="space-y-3">
      {reviews.map(r => (
        <ReviewCard key={r.id} review={r} onToggle={onToggle} />
      ))}
    </div>
  );
}

export default function DashboardClient({ reviews }: { reviews: NormalizedReview[] }) {
  const store = useDashboardStore();
  const [local, setLocal] = useState<NormalizedReview[]>(reviews);
  const router = useRouter();

  const applied = useMemo(() => store.apply(local), [local, store]);

  const toggle = async (id: number, approve: boolean) => {
    setLocal(prev => prev.map(r => (r.id === id ? { ...r, approvedForWebsite: approve } : r)));
    try {
      const res = await fetch(`/api/reviews/${id}/${approve ? "approve" : "unapprove"}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error(`Failed to ${approve ? "approve" : "unapprove"}`);
      router.refresh();
    } catch (e) {
      setLocal(prev => prev.map(r => (r.id === id ? { ...r, approvedForWebsite: !approve } : r)));
      console.error(e);
    }
  };

  return (
    <div className="flex w-full gap-6">
      <SidebarProperties
        reviews={local}
        selected={store.filters.listingId}
        onSelect={id => store.setListing(id)}
      />
      <div className="flex-1 space-y-4">
        <Filters />
        <DashboardCharts reviews={applied} />
        <ReviewsList reviews={applied} onToggle={toggle} />
      </div>
    </div>
  );
}
