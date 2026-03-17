import { NextResponse } from "next/server";

import { hasSpotifyCredentials, searchSpotifyTracks } from "@/features/profile/utils/spotify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!hasSpotifyCredentials()) {
    return NextResponse.json(
      { items: [], message: "Spotify credentials are not configured." },
      { status: 503 },
    );
  }

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  try {
    const items = await searchSpotifyTracks(query);

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { items: [], message: "Music search failed." },
      { status: 500 },
    );
  }
}
