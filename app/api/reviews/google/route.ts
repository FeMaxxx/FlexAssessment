import { NextResponse } from "next/server";
import { ApiResponse, NormalizedReview } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get("placeId");
    const listingId = searchParams.get("listingId") || "Google-Place";
    if (!placeId)
      return NextResponse.json(
        { status: "error", message: "Missing placeId" } satisfies ApiResponse<never>,
        { status: 400 }
      );

    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key)
      return NextResponse.json(
        {
          status: "error",
          message: "Server missing GOOGLE_MAPS_API_KEY",
        } satisfies ApiResponse<never>,
        { status: 500 }
      );

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=reviews,name&key=${key}`;
    const resp = await fetch(url);
    const json = await resp.json();
    const reviews = (json?.result?.reviews ?? []) as any[];

    const normalized: NormalizedReview[] = reviews.map(r => ({
      id: r.time,
      listingId,
      type: "stay",
      status: "published",
      ratingOverall: r.rating ?? null,
      categories: [],
      text: r.text ?? null,
      submittedAt: new Date((r.time ?? 0) * 1000).toISOString(),
      guestName: r.author_name ?? "Guest",
      channel: "google",
      approvedForWebsite: false,
    }));

    return NextResponse.json({
      status: "success",
      result: normalized,
    } satisfies ApiResponse<NormalizedReview[]>);
  } catch (e: any) {
    return NextResponse.json(
      { status: "error", message: e?.message ?? "Unknown error" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
