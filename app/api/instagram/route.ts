import { NextResponse } from "next/server";

// Instagram Graph API configuration
// You need to:
// 1. Create a Facebook Developer account at developers.facebook.com
// 2. Create an app and connect it to your Instagram business account
// 3. Get a long-lived access token
// 4. Set these environment variables in .env.local:
//    INSTAGRAM_ACCESS_TOKEN=your_token_here
//    INSTAGRAM_USER_ID=your_user_id_here

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const USER_ID = process.env.INSTAGRAM_USER_ID;

export async function GET() {
  if (!ACCESS_TOKEN || !USER_ID) {
    return NextResponse.json({ reels: [] }, { status: 200 });
  }

  try {
    // Fetch recent media (reels and posts)
    const response = await fetch(
      `https://graph.instagram.com/${USER_ID}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${ACCESS_TOKEN}&limit=9`
    );

    if (!response.ok) {
      return NextResponse.json({ reels: [] }, { status: 200 });
    }

    const data = await response.json();

    // Filter for reels and videos, map to our format
    const reels = data.data
      .filter((item: any) => item.media_type === "VIDEO")
      .slice(0, 6)
      .map((item: any) => ({
        id: item.id,
        caption: item.caption || "",
        thumbnail: item.thumbnail_url || item.media_url,
        mediaUrl: item.media_url,
        permalink: item.permalink,
        timestamp: item.timestamp,
      }));

    return NextResponse.json({ reels }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return NextResponse.json({ reels: [] }, { status: 200 });
  }
}
