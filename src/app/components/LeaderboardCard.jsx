export default function LeaderboardCard({
  label,
  rank,
  wpm,
  acc,
  consistency,
}) {
  return (
    <div
      className="
        rounded-2xl p-6
        bg-white/80 backdrop-blur-sm
        border border-blue-500/10
        shadow-sm shadow-blue-500/10

        dark:bg-slate-900/80
        dark:border-blue-500/10

        hover:-translate-y-0.5
        hover:shadow-md hover:shadow-blue-500/20
        transition
      "
    >
      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
        {label}
      </h3>

      <div className="text-4xl font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
        #{rank.toLocaleString()}
      </div>

      <div className="mt-3 text-sm text-gray-700 dark:text-gray-400">
        {Math.round(wpm)} WPM · {Math.round(acc)}% acc
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-500">
        {Math.round(consistency)}% consistency
      </div>
    </div>
  );
}
