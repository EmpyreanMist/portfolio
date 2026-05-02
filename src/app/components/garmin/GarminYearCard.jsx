import {
  formatCompactNumber,
  formatMonthShortLabel,
  formatNumber,
  formatYearLabel,
} from "./garminStepsUtils";

export default function GarminYearCard({
  goal,
  todayKey,
  yearGoalDays,
  yearMonths,
  yearSteps,
}) {
  const visibleMonths = yearMonths.filter((month) => !month.future);
  const elapsedMonths = visibleMonths.length;
  const elapsedDays = visibleMonths.reduce((sum, month) => sum + month.days, 0);
  const dailyAverageSteps =
    elapsedDays > 0 ? Math.round(yearSteps / elapsedDays) : null;
  const averageMonthSteps =
    elapsedMonths > 0 ? Math.round(yearSteps / elapsedMonths) : null;
  const bestMonth = visibleMonths.reduce(
    (best, month) => (!best || month.steps > best.steps ? month : best),
    null
  );
  const maxMonthSteps = Math.max(
    ...visibleMonths.map((month) => month.steps),
    goal,
    1
  );
  const yearLabel = formatYearLabel(todayKey);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm shadow-blue-500/10 dark:border-blue-400/40 dark:bg-blue-500/10 dark:shadow-none sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            This year
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {yearLabel} to date
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="Year to date"
          value={formatNumber(yearSteps)}
          detail={`${yearLabel} so far`}
        />

        <Metric
          label="Daily average"
          value={dailyAverageSteps === null ? "-" : formatNumber(dailyAverageSteps)}
          detail={`${formatNumber(elapsedDays)} days so far`}
        />

        <Metric
          label="Per month avg"
          value={
            averageMonthSteps === null ? "-" : formatNumber(averageMonthSteps)
          }
          detail={`${formatNumber(elapsedMonths)} months tracked`}
        />

        <Metric
          label={`${formatNumber(goal)}+ days`}
          value={formatNumber(yearGoalDays)}
          detail="Goal reached"
          tone="gold"
        />

        <Metric
          label="Best month"
          value={bestMonth ? formatMonthShortLabel(bestMonth.month) : "-"}
          detail={
            bestMonth ? `${formatNumber(bestMonth.steps)} steps` : "No data yet"
          }
        />
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h4 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
              Monthly breakdown
            </h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Each bar shows total steps for the month. The current month is
              highlighted in gold.
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-lg border border-blue-500/10 bg-blue-50/50 p-4 dark:border-blue-400/20 dark:bg-blue-500/5">
          <div
            className="grid min-w-[760px] grid-cols-12 items-end gap-3"
            aria-label={`Monthly totals for ${yearLabel}`}
          >
            {yearMonths.map((month) => (
              <div key={month.month} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-medium tabular-nums text-gray-500 dark:text-gray-500">
                  {month.future ? "-" : formatCompactNumber(month.steps)}
                </span>

                <div className="flex h-40 items-end">
                  <div
                    className={`w-10 rounded-t-md border transition-all ${getBarColor(
                      month
                    )} ${
                      month.isCurrent
                        ? "ring-2 ring-amber-300/70 ring-offset-2 ring-offset-blue-50 dark:ring-offset-slate-950"
                        : ""
                    }`}
                    style={{
                      height: `${getBarHeight(month.steps, maxMonthSteps, month.future)}px`,
                    }}
                    title={getMonthTitle(month)}
                    aria-label={getMonthTitle(month)}
                  />
                </div>

                <div className="text-center">
                  <div
                    className={`text-xs font-semibold ${
                      month.isCurrent
                        ? "text-amber-600 dark:text-amber-300"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {formatMonthShortLabel(month.month)}
                  </div>

                  <div className="mt-1 text-[10px] text-gray-500 dark:text-gray-500">
                    {month.future
                      ? "Upcoming"
                      : `${formatNumber(month.goalDays)} goal days`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
          Future months are shown as placeholders so the full year stays visible
          at a glance.
        </p>
      </div>
    </section>
  );
}

function Metric({ label, value, detail, tone = "blue" }) {
  const valueColor =
    tone === "gold"
      ? "text-amber-500 dark:text-amber-300"
      : "text-blue-700 dark:text-blue-400";

  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
        {label}
      </div>

      <div className={`text-3xl font-semibold tabular-nums ${valueColor}`}>
        {value}
      </div>

      <div className="mt-1 text-xs text-gray-600 dark:text-gray-500">
        {detail}
      </div>
    </div>
  );
}

function getBarHeight(steps, maxMonthSteps, future) {
  if (future) {
    return 12;
  }

  if (steps <= 0) {
    return 16;
  }

  return Math.max(18, Math.round((steps / maxMonthSteps) * 160));
}

function getBarColor(month) {
  if (month.future) {
    return "border-dashed border-gray-300 bg-gray-100 dark:border-blue-400/20 dark:bg-blue-400/5";
  }

  if (month.isCurrent) {
    return "border-amber-300 bg-amber-300 dark:border-amber-300 dark:bg-amber-300";
  }

  return "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400";
}

function getMonthTitle(month) {
  if (month.future) {
    return `${month.month}: upcoming`;
  }

  return `${month.month}: ${formatNumber(month.steps)} steps, ${formatNumber(
    month.goalDays
  )} goal days`;
}
