import { HostawayRawReview, NormalizedReview } from "./types";

function mapCategories(cats?: { category: string; rating: number }[]) {
  if (!cats) return [] as { name: string; rating: number }[];
  return cats.map(c => ({ name: c.category, rating: Math.round((c.rating / 2) * 10) / 10 }));
}

export function normalizeHostawayData(raw: HostawayRawReview[]): NormalizedReview[] {
  return raw.map(r => {
    const rating5 = r.rating == null ? null : Math.round((r.rating / 2) * 10) / 10;
    return {
      id: r.id,
      listingId: r.listingName,
      type: r.type,
      status: r.status ?? "published",
      ratingOverall: rating5,
      categories: mapCategories(r.reviewCategory),
      text: r.publicReview ?? null,
      submittedAt: new Date(r.submittedAt).toISOString(),
      guestName: r.guestName || "Guest",
      channel: "hostaway",
      approvedForWebsite: false,
    } satisfies NormalizedReview;
  });
}
