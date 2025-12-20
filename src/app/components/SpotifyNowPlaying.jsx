"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlueLoader from "./BlueLoader";

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch("/api/spotify/now-playing");
        const data = await res.json();
        setTrack(data ?? null);
      } catch {
        setTrack(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mt-32 flex flex-col items-center text-center">
      <h2 className="text-sm uppercase tracking-widest mb-3 text-blue-700 dark:text-blue-400">
        Spotify · Now playing
      </h2>

      <p className="text-sm max-w-xl mb-10 text-gray-700 dark:text-gray-400">
        Live listening data from Spotify.
      </p>

      <div className="w-full max-w-4xl">
        {loading ? (
          <div className="h-[120px] flex items-center justify-center">
            <BlueLoader />
          </div>
        ) : track ? (
          <div
            className="
              flex items-center gap-5
              rounded-xl border
              border-gray-200 dark:border-blue-400/40
              bg-white dark:bg-blue-500/10
              px-6 py-4
            "
          >
            {track.image && (
              <Image
                src={track.image}
                alt={track.title}
                width={64}
                height={64}
                className="rounded-md"
              />
            )}

            <div className="flex-1 text-left overflow-hidden">
              <p className="font-semibold text-blue-700 dark:text-gray-100 truncate">
                {track.title}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
                {track.artist}
              </p>

              <div className="mt-1 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400/90">
                {track.isPlaying && <Equalizer />}
                {track.isPlaying ? "Playing now" : "Last played"}
              </div>
            </div>

            {track.url && (
              <Link
                href={track.url}
                target="_blank"
                className="
                  text-xs
                  text-blue-600 hover:text-blue-700
                  dark:text-blue-400 dark:hover:text-blue-300
                  transition-colors
                "
              >
                Open
              </Link>
            )}
          </div>
        ) : (
          <div className="h-[120px] flex items-center justify-center text-sm text-gray-400">
            Not playing anything right now.
          </div>
        )}
      </div>

      <div className="mt-24 h-px w-40 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </section>
  );
}

function Equalizer() {
  return (
    <span className="flex gap-[2px] items-end">
      <span className="eq-bar" />
      <span className="eq-bar delay-100" />
      <span className="eq-bar delay-200" />
    </span>
  );
}
