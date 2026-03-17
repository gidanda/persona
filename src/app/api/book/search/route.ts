import { NextResponse } from "next/server";

import { searchGoogleBooks } from "@/features/profile/utils/google-books";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  try {
    const items = await searchGoogleBooks(query);

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { items: [], message: "Book search failed." },
      { status: 500 },
    );
  }
}
