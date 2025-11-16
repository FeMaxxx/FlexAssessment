export type ReviewChannel = "hostaway" | "google";

export interface ReviewCategory {
  name: string;
  rating: number;
}

export interface NormalizedReview {
  id: number;
  listingId: string;
  type: string;
  status: string;
  ratingOverall: number | null;
  categories: ReviewCategory[];
  text: string | null;
  submittedAt: string;
  guestName: string;
  channel: ReviewChannel;
  approvedForWebsite: boolean;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  result?: T;
  message?: string;
}

export interface HostawayRawReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string | null;
  reviewCategory?: { category: string; rating: number }[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}
