"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import StatsCard from "./StatsCard";
import BlueLoader from "./BlueLoader";

export default function MonkeytypeStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/monkeytype")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const timeTests = ["15", "30", "60", "120"].map((t) => ({
    label: `${t}s`,
    wpm: Math.round(stats?.time?.[t]?.wpm ?? 0),
    acc: Math.round(stats?.time?.[t]?.acc ?? 0),
  }));

  const wordTests = ["10", "25", "50", "100"].map((w) => ({
    label: `${w}w`,
    wpm: Math.round(stats?.words?.[w]?.wpm ?? 0),
    acc: Math.round(stats?.words?.[w]?.acc ?? 0),
  }));

  return (
    <section className="mt-32 flex flex-col items-center text-center">
      <h2 className="text-sm uppercase tracking-widest mb-3 text-blue-700 dark:text-blue-400">
        Typing performance
      </h2>

      <p className="text-sm max-w-xl mb-10 text-gray-700 dark:text-gray-400">
        Live data fetched from{" "}
        <Link
          target="_blank"
          href="https://monkeytype.com/profile/EmpyreanMist"
          className="
            underline
            text-blue-700 hover:text-blue-600
            dark:text-blue-400 dark:hover:text-blue-300
            transition-colors
          "
        >
          Monkeytype
        </Link>
        .
      </p>

      {!stats ? (
        <div className="h-[220px] w-full flex items-center justify-center">
          <BlueLoader />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl">
            <StatsCard title="Time based" data={timeTests} mode="time" />
            <StatsCard title="Words based" data={wordTests} mode="words" />
          </div>

          {/* Section separator */}
          <div className="mt-24 h-px w-40 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        </>
      )}
    </section>
  );
}
