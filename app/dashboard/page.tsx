import { ApiResponse, NormalizedReview } from "@/lib/types";
import DashboardClient from "@/components/DashboardClient";
import { headers } from "next/headers";

function getBaseUrl() {
  const h = headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

async function getReviews(): Promise<NormalizedReview[]> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/reviews/hostaway`, {
    cache: "no-store",
    next: { tags: ["reviews"] },
  });
  const data = (await res.json()) as ApiResponse<NormalizedReview[]>;
  if (data.status !== "success" || !data.result) return [];
  return data.result;
}

export default async function DashboardPage() {
  const reviews = await getReviews();

  return (
    <div className="container-responsive py-6 flex gap-6">
      <DashboardClient reviews={reviews} />
    </div>
  );
}
