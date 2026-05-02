import { formatMonthLabel, formatNumber } from "./garminStepsUtils";
import {
  labsCardHoverClassName,
  labsDataHoverClassName,
} from "../labs/labsClassNames";

export default function GarminMonthCard({
  monthDays,
  monthGoal,
  monthGoalDays,
  monthSteps,
}) {
  const elapsedMonthDays = monthDays.filter((day) => !day.future).length;
  const monthDailyAverage =
    elapsedMonthDays > 0 ? Math.round(monthSteps / elapsedMonthDays) : null;
  const monthLabel = formatMonthLabel(monthDays[0]?.date);
  const daysRemaining = monthDays.filter((day) => day.future).length;
  const bestDay = monthDays
    .filter((day) => !day.future)
    .reduce((best, day) => (!best || day.steps > best.steps ? day : best), null);
  const goalHitRate =
    elapsedMonthDays > 0 ? Math.round((monthGoalDays / elapsedMonthDays) * 100) : null;

  return (
    <section
      tabIndex={0}
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm shadow-blue-500/10 dark:border-blue-400/40 dark:bg-blue-500/10 dark:shadow-none sm:p-7 ${labsCardHoverClassName}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            This month
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {monthLabel}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Monthly steps"
          value={formatNumber(monthSteps)}
          detail={monthLabel}
        />

        <Metric
          label="Daily average"
          value={
            monthDailyAverage === null ? "-" : formatNumber(monthDailyAverage)
          }
          detail={`${formatNumber(elapsedMonthDays)} days so far`}
        />

        <Metric
          label={`${formatNumber(monthGoal)}+ days`}
          value={formatNumber(monthGoalDays)}
          detail="Goal reached"
          tone="gold"
        />

        <Metric
          label="Daily target"
          value={formatNumber(monthGoal)}
          detail="Steps per day"
        />
      </div>

      <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-200 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
        <div className="min-h-0 overflow-hidden">
          <div className="mt-5 grid gap-3 border-t border-blue-500/10 pt-4 text-xs text-gray-600 dark:border-blue-400/20 dark:text-gray-400 sm:grid-cols-3">
            <div className={labsDataHoverClassName}>
              <div className="font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500">
                Best day
              </div>
              <div className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                {bestDay
                  ? `${bestDay.date.slice(-2)}: ${formatNumber(bestDay.steps)} steps`
                  : "No data yet"}
              </div>
            </div>

            <div className={labsDataHoverClassName}>
              <div className="font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500">
                Goal hit rate
              </div>
              <div className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                {goalHitRate === null ? "-" : `${goalHitRate}% of tracked days`}
              </div>
            </div>

            <div className={labsDataHoverClassName}>
              <div className="font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500">
                Remaining days
              </div>
              <div className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                {formatNumber(daysRemaining)} left this month
              </div>
            </div>
          </div>
        </div>
      </div>

      <MonthlyHeatmap
        days={monthDays}
        goal={monthGoal}
        goalDays={monthGoalDays}
        monthLabel={monthLabel}
      />
    </section>
  );
}

function Metric({ label, value, detail, tone = "blue" }) {
  const valueColor =
    tone === "gold"
      ? "text-amber-500 dark:text-amber-300"
      : "text-blue-700 dark:text-blue-400";

  return (
    <div className={labsDataHoverClassName}>
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

function MonthlyHeatmap({ days, goal, goalDays, monthLabel }) {
  const cells = buildCalendarCells(days);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h4 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            Daily heatmap
          </h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {monthLabel}: {formatNumber(goalDays)} days reached{" "}
            {formatNumber(goal)}+ steps.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          <span>Less</span>
          {[0, 1, 2, 3].map((intensity) => (
            <span
              key={intensity}
              className={`h-3 w-3 rounded-sm border ${getIntensityColor(
                intensity
              )}`}
            />
          ))}
          <span>More</span>
          <span className="ml-2 h-3 w-3 rounded-sm border border-amber-300 bg-amber-300" />
          <span>10k+</span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-blue-500/10 bg-blue-50/50 p-4 dark:border-blue-400/20 dark:bg-blue-500/5">
        <div className="mx-auto w-max">
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-medium uppercase text-gray-400 dark:text-gray-500 sm:gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="w-8 sm:w-9">
                {day}
              </span>
            ))}
          </div>

          <div
            className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2"
            aria-label={`${formatNumber(goal)} step goal heatmap for ${monthLabel}`}
          >
            {cells.map((cell, index) =>
              cell ? (
                <span
                  key={cell.date}
                  className={`flex h-8 w-8 items-center justify-center rounded border text-[10px] font-semibold tabular-nums sm:h-9 sm:w-9 ${getHeatmapColor(
                    cell
                  )} ${
                    cell.isToday
                      ? "ring-2 ring-blue-400/70 ring-offset-2 ring-offset-blue-50 dark:ring-offset-slate-950"
                      : ""
                  } transition-transform duration-150 hover:-translate-y-0.5 hover:scale-[1.04]`}
                  title={getDayTitle(cell)}
                  aria-label={getDayTitle(cell)}
                >
                  {Number(cell.date.slice(-2))}
                </span>
              ) : (
                <span key={`blank-${index}`} className="h-8 w-8 sm:h-9 sm:w-9" />
              )
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
        Grey dashed days have not happened yet. Gold means the{" "}
        {formatNumber(goal)} step goal was reached.
      </p>
    </div>
  );
}

function buildCalendarCells(days) {
  if (!days.length) {
    return [];
  }

  const leadingBlanks = getSundayWeekdayIndex(days[0].date);
  const totalCells = leadingBlanks + days.length;
  const trailingBlanks = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...days,
    ...Array.from({ length: trailingBlanks }, () => null),
  ];
}

function getSundayWeekdayIndex(date) {
  return new Date(`${date}T12:00:00`).getDay();
}

function getHeatmapColor(cell) {
  if (cell.future) {
    return "border-dashed border-gray-300 bg-gray-100 text-gray-400 dark:border-blue-400/20 dark:bg-blue-400/5 dark:text-gray-500";
  }

  if (cell.goalMet) {
    return "border-amber-300 bg-amber-300 text-amber-950 shadow-sm shadow-amber-400/30 dark:border-amber-300 dark:bg-amber-300 dark:text-amber-950";
  }

  return getIntensityColor(cell.intensity);
}

function getIntensityColor(intensity) {
  const colors = [
    "border-gray-200 bg-white text-gray-400 dark:border-blue-400/10 dark:bg-white/10 dark:text-gray-500",
    "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-900/70 dark:bg-blue-950 dark:text-blue-200",
    "border-blue-300 bg-blue-200 text-blue-900 dark:border-blue-700 dark:bg-blue-800 dark:text-blue-100",
    "border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-400 dark:text-blue-950",
  ];

  return colors[intensity] || colors[0];
}

function getDayTitle(day) {
  if (day.future) {
    return `${day.date}: not happened yet`;
  }

  return `${day.date}: ${formatNumber(day.steps)} steps`;
}
