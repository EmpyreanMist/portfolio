function pickBest(entry) {
  if (!Array.isArray(entry) || entry.length === 0) return null;
  return entry[0];
}

export async function GET() {
  const headers = {
    Authorization: `ApeKey ${process.env.MONKEYTYPE_API_KEY}`,
  };

  try {
    const [timeRes, wordsRes, rank15Res, rank60Res] = await Promise.all([
      fetch("https://api.monkeytype.com/users/personalBests?mode=time", {
        headers,
        cache: "no-store",
      }),
      fetch("https://api.monkeytype.com/users/personalBests?mode=words", {
        headers,
        cache: "no-store",
      }),
      fetch(
        "https://api.monkeytype.com/leaderboards/rank?language=english&mode=time&mode2=15",
        { headers, cache: "no-store" }
      ),
      fetch(
        "https://api.monkeytype.com/leaderboards/rank?language=english&mode=time&mode2=60",
        { headers, cache: "no-store" }
      ),
    ]);

    const timeData = await timeRes.json();
    const wordsData = await wordsRes.json();
    const rank15 = await rank15Res.json();
    const rank60 = await rank60Res.json();

    const bestTime = Object.fromEntries(
      Object.entries(timeData.data).map(([key, value]) => [
        key,
        pickBest(value),
      ])
    );

    const bestWords = Object.fromEntries(
      Object.entries(wordsData.data).map(([key, value]) => [
        key,
        pickBest(value),
      ])
    );

    return Response.json({
      personalBests: {
        time: bestTime,
        words: bestWords,
      },
      leaderboard: {
        english: {
          time: {
            "15s": {
              rank: rank15.data.rank,
              wpm: rank15.data.wpm,
              acc: rank15.data.acc,
              consistency: rank15.data.consistency,
            },
            "60s": {
              rank: rank60.data.rank,
              wpm: rank60.data.wpm,
              acc: rank60.data.acc,
              consistency: rank60.data.consistency,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("MONKEYTYPE API ERROR", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch Monkeytype data" }),
      { status: 500 }
    );
  }
}
