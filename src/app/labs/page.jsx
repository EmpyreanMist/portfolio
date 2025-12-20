import MonkeytypeStats from "../components/MonkeyTypeStats";
import SpotifyNowPlaying from "../components/SpotifyNowPlaying";
export default function LabsPage() {
  return (
    <main
      className="
    min-h-screen px-6
    bg-gradient-to-b
    from-slate-50 via-blue-50/60 to-white
    dark:from-black dark:via-slate-950 dark:to-black
    text-gray-900 dark:text-gray-100
  "
    >
      <div className="max-w-2xl mx-auto pt-32 text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-700 dark:text-blue-400">
          Labs
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          Experiments, stats and things I build out of curiosity.
        </p>
      </div>

      <MonkeytypeStats />
      <SpotifyNowPlaying />
    </main>
  );
}
