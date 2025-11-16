import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { setApproved } from "@/lib/reviewStore";

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  try {
    await setApproved(params.id, false);
    revalidateTag("reviews");
    return NextResponse.json({ status: "success" });
  } catch (e: any) {
    return NextResponse.json(
      { status: "error", message: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
