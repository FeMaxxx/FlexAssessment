import Link from "next/link";
import { headers } from "next/headers";
import { ApiResponse, NormalizedReview } from "@/lib/types";
import { slugify, formatDate } from "@/lib/utils";

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

export default async function Home() {
  const all = await getReviews();
  const byListing = new Map<string, NormalizedReview[]>();
  for (const r of all) {
    const key = r.listingId;
    const arr = byListing.get(key) || [];
    arr.push(r);
    byListing.set(key, arr);
  }
  const properties = Array.from(byListing.entries())
    .map(([listing, reviews]) => {
      const ratings = reviews.map(r => r.ratingOverall).filter((n): n is number => n != null);
      const avg = ratings.length
        ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
        : null;
      const approvedCount = reviews.filter(r => r.approvedForWebsite).length;
      return { listing, slug: slugify(listing), count: reviews.length, approvedCount, avg };
    })
    .sort((a, b) => a.listing.localeCompare(b.listing));

  const allRatings = all.map(r => r.ratingOverall).filter((n): n is number => n != null);
  const overallAvg = allRatings.length
    ? +(allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2)
    : null;

  return (
    <div className="container-responsive py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Properties</h1>
        <Link href="/dashboard" className="text-sm text-primary-700 hover:underline">
          Go to Dashboard →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-500">Total properties</div>
          <div className="text-2xl font-semibold">{properties.length}</div>
        </div>
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-500">Avg rating</div>
          <div className="text-2xl font-semibold">{overallAvg ?? "N/A"}</div>
        </div>
      </div>

      <div className="bg-white border rounded">
        <div className="p-4 border-b text-sm text-gray-600">All properties</div>
        <ul className="divide-y">
          {properties.map(p => (
            <li key={p.slug} className="p-4 flex items-center justify-between">
              <div>
                <Link className="font-medium hover:underline" href={`/property/${p.slug}`}>
                  {p.listing}
                </Link>
                <div className="text-xs text-gray-500">
                  Reviews: {p.count} • Approved: {p.approvedCount}
                </div>
              </div>
              <div className="text-sm">
                Avg: <span className="font-medium">{p.avg ?? "N/A"}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
