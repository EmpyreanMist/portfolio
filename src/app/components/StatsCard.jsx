import {
  labsCardHoverClassName,
  labsDataHoverClassName,
} from "./labs/labsClassNames";

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
      className={`
    rounded-2xl p-6 backdrop-blur-sm
    bg-white/80
    border border-blue-500/10
    shadow-sm shadow-blue-500/10

    dark:bg-slate-900/80
    dark:border-blue-500/10
    dark:shadow-none
    ${labsCardHoverClassName}
  `}
    >
      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
        {title}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {data.map((item) => (
          <div
            key={item.label}
            tabIndex={0}
            className={`group/item ${labsDataHoverClassName}`}
          >
            <div className="text-3xl font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
              {item.wpm}
            </div>

            <div className="text-xs text-gray-700 dark:text-gray-500">
              {formatLabel(item.label)}
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-500">
              {item.acc}% accuracy
            </div>

            <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-200 ease-out group-hover/item:grid-rows-[1fr] group-hover/item:opacity-100 group-focus-within/item:grid-rows-[1fr] group-focus-within/item:opacity-100">
              <div className="min-h-0 overflow-hidden">
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                  {item.raw > 0 && (
                    <span className="rounded-full border border-blue-500/10 bg-blue-50 px-2 py-1 dark:border-blue-400/20 dark:bg-blue-400/10">
                      Raw {item.raw} WPM
                    </span>
                  )}
                  {item.consistency > 0 && (
                    <span className="rounded-full border border-blue-500/10 bg-blue-50 px-2 py-1 dark:border-blue-400/20 dark:bg-blue-400/10">
                      {item.consistency}% consistency
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
