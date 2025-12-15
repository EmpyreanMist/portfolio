export default function BlueLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-blue-700 dark:text-blue-400">
      <span
        className="
          inline-block h-10 w-10 rounded-full
          border-4 border-blue-500/30
          border-t-blue-600 dark:border-t-blue-400
          animate-spin
        "
      />
      <span className="text-sm tracking-wide">Fetching live stats…</span>
    </div>
  );
}
