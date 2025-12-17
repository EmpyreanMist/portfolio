export default function StatsCard({ title, data, mode }) {
  function formatLabel(label) {
    const value = label.match(/\d+/)?.[0];

    if (!value) return label;

    if (mode === "time") {
      return `${value} seconds`;
    }

    if (mode === "words") {
      return `${value} words`;
    }

    return label;
  }

  return (
    <div
      className="
    rounded-2xl p-6 backdrop-blur-sm
    bg-white/80
    border border-blue-500/10
    shadow-sm shadow-blue-500/10

    dark:bg-slate-900/80
    dark:border-blue-500/10
    dark:shadow-none

    hover:-translate-y-0.5
    hover:shadow-md hover:shadow-blue-500/20
    hover:transition-shadow hover:duration-200
  "
    >
      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
        {title}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {data.map((item) => (
          <div key={item.label}>
            <div className="text-3xl font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
              {item.wpm}
            </div>

            <div className="text-xs text-gray-700 dark:text-gray-500">
              {formatLabel(item.label)}
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-500">
              {item.acc}% accuracy
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
