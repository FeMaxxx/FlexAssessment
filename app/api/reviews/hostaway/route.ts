import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { promises as fs } from "fs";
import path from "path";
import { ApiResponse, NormalizedReview, HostawayRawReview } from "@/lib/types";
import { normalizeHostawayData } from "@/lib/normalizeHostaway";
import { getApprovedMap } from "@/lib/reviewStore";

export async function GET() {
  noStore();
  try {
    const file = path.join(process.cwd(), "data", "hostaway-sample.json");
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as HostawayRawReview[];
    const normalized = normalizeHostawayData(parsed);
    const approvedMap = await getApprovedMap();
    const withApproval: NormalizedReview[] = normalized.map(r => ({
      ...r,
      approvedForWebsite: approvedMap[String(r.id)] ?? false,
    }));

    const res: ApiResponse<NormalizedReview[]> = {
      status: "success",
      result: withApproval,
    };
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json(
      { status: "error", message: e?.message ?? "Unknown error" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
