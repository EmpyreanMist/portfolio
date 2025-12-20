import { NextResponse } from "next/server";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

let lastPlayedTrack = null;
let lastPlayedAt = null;

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Spotify env vars");
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to refresh Spotify token");
  }

  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (res.status === 204 || !res.ok) {
      return NextResponse.json({
        isPlaying: false,
        track: lastPlayedTrack,
        lastPlayedAt,
      });
    }

    const data = await res.json();
    const item = data?.item;

    if (!item) {
      return NextResponse.json({
        isPlaying: false,
        track: lastPlayedTrack,
        lastPlayedAt,
      });
    }

    lastPlayedTrack = {
      title: item.name,
      artist: item.artists.map((a) => a.name).join(", "),
      album: item.album.name,
      image: item.album.images[0]?.url ?? null,
      url: item.external_urls.spotify,
      isPlaying: data.is_playing,
      progressMs: data.progress_ms,
      durationMs: item.duration_ms,
    };

    lastPlayedAt = Date.now();

    return NextResponse.json({
      isPlaying: data.is_playing,
      track: lastPlayedTrack,
      lastPlayedAt,
    });
  } catch (err) {
    return NextResponse.json({
      isPlaying: false,
      track: lastPlayedTrack,
      lastPlayedAt,
    });
  }
}
