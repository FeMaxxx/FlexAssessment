import { ApiResponse, NormalizedReview } from "@/lib/types";
import { slugify, formatDate } from "@/lib/utils";
import { headers } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function PropertyPage({ params }: { params: { listingSlug: string } }) {
  const all = await getReviews();
  const approved = all.filter(r => r.approvedForWebsite);
  const reviewsForSlug = approved.filter(r => slugify(r.listingId) === params.listingSlug);
  const noMatch = reviewsForSlug.length === 0;
  const reviews = noMatch ? approved : reviewsForSlug;
  const available = Array.from(new Set(approved.map(r => slugify(r.listingId)))).sort();

  return (
    <div className="container-responsive py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-2xl font-semibold">
            Property: {params.listingSlug.replace(/-/g, " ")}
          </h1>
          <p className="text-gray-600">
            Welcome to this Flex Living property. Below are recent guest reviews approved for
            display.
          </p>

          <section className="space-y-3">
            {reviews.length === 0 && <div className="text-gray-500">No approved reviews yet.</div>}
            {noMatch && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded p-3">
                No reviews found for this property slug.
                {available.length > 0 && (
                  <div className="mt-2">
                    Try one of these property pages:
                    <ul className="list-disc list-inside">
                      {available.map(s => (
                        <li key={s}>
                          <Link prefetch={false} href={`/property/${s}`} className="underline">
                            /property/{s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!noMatch &&
              reviews.map(r => (
                <div key={r.id} className="bg-white border rounded p-4">
                  <div className="text-sm text-gray-500">
                    {formatDate(r.submittedAt)} — {r.guestName}
                  </div>
                  <div className="font-medium">Rating: {r.ratingOverall ?? "N/A"}</div>
                  <div className="text-gray-700">{r.text || <em>No comment provided.</em>}</div>
                </div>
              ))}
          </section>
        </div>
        <aside className="space-y-3">
          <div className="bg-white border rounded p-4">
            <div className="font-medium mb-1">Property info</div>
            <div className="text-sm text-gray-600">
              This is a placeholder for property description and amenities.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
