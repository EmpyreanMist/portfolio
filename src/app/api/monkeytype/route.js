function pickBest(entry) {
  if (!Array.isArray(entry) || entry.length === 0) return null;
  return entry[0];
}

export async function GET() {
  const headers = {
    Authorization: `ApeKey ${process.env.MONKEYTYPE_API_KEY}`,
  };

  const [timeRes, wordsRes] = await Promise.all([
    fetch("https://api.monkeytype.com/users/personalBests?mode=time", {
      headers,
      cache: "no-store",
    }),
    fetch("https://api.monkeytype.com/users/personalBests?mode=words", {
      headers,
      cache: "no-store",
    }),
  ]);

  const timeData = await timeRes.json();
  const wordsData = await wordsRes.json();

  const normalize = (data) =>
    Object.fromEntries(
      Object.entries(data.data).map(([key, value]) => [key, pickBest(value)])
    );

  return Response.json({
    time: normalize(timeData),
    words: normalize(wordsData),
  });
}
