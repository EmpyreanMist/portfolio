import { formatNumber, formatUpdatedAt } from "./garminStepsUtils";

export default function GarminTodayCard({ date, goal, steps, updatedAt }) {
  const hasGoal = typeof goal === "number" && goal > 0;
  const goalProgress = hasGoal
    ? Math.min(100, Math.max(0, (steps / goal) * 100))
    : null;
  const reachedGoal = hasGoal && steps >= goal;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm shadow-blue-500/10 dark:border-blue-400/40 dark:bg-blue-500/10 dark:shadow-none sm:p-7">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="mb-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            Today
          </h3>

          <div
            className={`text-5xl font-semibold tabular-nums sm:text-6xl ${
              reachedGoal
                ? "text-amber-500 dark:text-amber-300"
                : "text-blue-700 dark:text-blue-400"
            }`}
          >
            {formatNumber(steps)}
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 sm:text-right">
          {hasGoal && (
            <div>
              Goal:{" "}
              <span className="font-medium tabular-nums text-gray-800 dark:text-gray-200">
                {formatNumber(goal)}
              </span>
            </div>
          )}

          {updatedAt && (
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Updated {formatUpdatedAt(updatedAt)}
            </div>
          )}
        </div>
      </div>

      {hasGoal && (
        <div className="mt-7">
          <div className="h-2.5 w-full overflow-hidden rounded bg-blue-100 dark:bg-white/10">
            <div
              className={`h-2.5 rounded ${
                reachedGoal ? "bg-amber-400" : "bg-blue-500"
              }`}
              style={{ width: `${goalProgress}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between gap-4 text-xs text-gray-500 dark:text-gray-500">
            <span>{Math.round(goalProgress)}% complete</span>
            <span>{date}</span>
          </div>
        </div>
      )}
    </section>
  );
}
