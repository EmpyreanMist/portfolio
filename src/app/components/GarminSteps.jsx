"use client";
import { useEffect, useMemo, useState } from "react";
import BlueLoader from "./BlueLoader";

const REFRESH_INTERVAL_MS = 60 * 60 * 1000;
const DEFAULT_STEP_GOAL = 10000;

export default function GarminSteps() {
  const [steps, setSteps] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSteps = async () => {
      try {
        const res = await fetch("/api/garmin/steps");
        const json = await res.json();

        if (isMounted) {
          setSteps(json);
        }
      } catch {
        if (isMounted) {
          setSteps(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSteps();
    const interval = setInterval(fetchSteps, REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const hasSteps = typeof steps?.steps === "number";
  const hasGoal = typeof steps?.goal === "number" && steps.goal > 0;
  const monthGoal = steps?.monthGoal ?? DEFAULT_STEP_GOAL;
  const todayKey = steps?.date || getLocalDateKey(new Date());
  const monthDays = useMemo(
    () => buildFullMonthDays(steps?.monthDays, monthGoal, todayKey),
    [steps?.monthDays, monthGoal, todayKey]
  );
  const hasMonthDays = monthDays.length > 0;
  const hasMonthSteps = typeof steps?.monthSteps === "number";
  const monthSteps = hasMonthSteps
    ? steps.monthSteps
    : monthDays.reduce((sum, day) => sum + (day.steps || 0), 0);
  const monthGoalDays =
    typeof steps?.monthGoalDays === "number"
      ? steps.monthGoalDays
      : monthDays.filter((day) => day.goalMet).length;
  const monthLabel = formatMonthLabel(
    monthDays[0]?.date || steps?.monthStart || steps?.date
  );
  const goalProgress = hasGoal
    ? Math.min(100, Math.max(0, (steps.steps / steps.goal) * 100))
    : null;
  const reachedTodayGoal = hasGoal && steps.steps >= steps.goal;

  return (
    <section className="mt-32 flex flex-col items-center pb-24 text-center">
      <h2 className="mb-3 text-sm uppercase tracking-widest text-blue-700 dark:text-blue-400">
        Garmin / Today
      </h2>

      <p className="mb-10 max-w-xl text-sm text-gray-700 dark:text-gray-400">
        Steps walked today and this month, refreshed once every hour.
      </p>

      <div className="w-full max-w-5xl">
        {loading ? (
          <div className="flex h-[220px] items-center justify-center">
            <BlueLoader />
          </div>
        ) : hasSteps ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm shadow-blue-500/10 dark:border-blue-400/40 dark:bg-blue-500/10 dark:shadow-none sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="mb-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Steps today
                </h3>

                <div
                  className={`text-5xl font-semibold tabular-nums sm:text-6xl ${
                    reachedTodayGoal
                      ? "text-amber-500 dark:text-amber-300"
                      : "text-blue-700 dark:text-blue-400"
                  }`}
                >
                  {formatNumber(steps.steps)}
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 sm:text-right">
                {hasGoal && (
                  <div>
                    Goal:{" "}
                    <span className="font-medium tabular-nums text-gray-800 dark:text-gray-200">
                      {formatNumber(steps.goal)}
                    </span>
                  </div>
                )}

                {steps.updatedAt && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Updated {formatUpdatedAt(steps.updatedAt)}
                  </div>
                )}
              </div>
            </div>

            {hasGoal && (
              <div className="mt-7">
                <div className="h-2.5 w-full overflow-hidden rounded bg-blue-100 dark:bg-white/10">
                  <div
                    className={`h-2.5 rounded ${
                      reachedTodayGoal
                        ? "bg-amber-400"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between gap-4 text-xs text-gray-500 dark:text-gray-500">
                  <span>{Math.round(goalProgress)}% complete</span>
                  <span>{steps.date}</span>
                </div>
              </div>
            )}

            {(hasMonthSteps || hasMonthDays) && (
              <div className="mt-8 border-t border-blue-500/10 pt-7 dark:border-blue-400/20">
                <div className="grid gap-5 sm:grid-cols-3">
                  <Metric
                    label="Monthly steps"
                    value={formatNumber(monthSteps)}
                    detail={monthLabel}
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

                {hasMonthDays && (
                  <MonthlyHeatmap
                    days={monthDays}
                    goal={monthGoal}
                    goalDays={monthGoalDays}
                    monthLabel={monthLabel}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-[180px] items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-500 dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-gray-400">
            Garmin step data is not available yet.
          </div>
        )}
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

function MonthlyHeatmap({ days, goal, goalDays, monthLabel }) {
  const cells = buildCalendarCells(days);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            Daily heatmap
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {monthLabel}: {formatNumber(goalDays ?? 0)} days reached{" "}
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
                  }`}
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

function buildFullMonthDays(rawDays, goal, todayKey) {
  const sourceDays = Array.isArray(rawDays) ? rawDays : [];
  const firstDate = sourceDays.find((day) => day?.date)?.date || todayKey;
  const monthKey = firstDate?.slice(0, 7);

  if (!monthKey) {
    return [];
  }

  const daysByDate = new Map(
    sourceDays
      .filter((day) => day?.date)
      .map((day) => [day.date, day])
  );

  return enumerateMonthDates(monthKey).map((date) => {
    const source = daysByDate.get(date);
    const isFuture = date > todayKey;

    if (isFuture) {
      return {
        date,
        future: true,
        goalMet: false,
        intensity: null,
        steps: null,
        isToday: false,
      };
    }

    const steps = readNumericValue(source?.steps) ?? 0;

    return {
      date,
      future: false,
      goalMet: steps >= goal,
      intensity: getStepIntensity(steps, goal),
      steps,
      isToday: date === todayKey,
    };
  });
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

function enumerateMonthDates(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return `${monthKey}-${day}`;
  });
}

function getSundayWeekdayIndex(date) {
  return new Date(`${date}T12:00:00`).getDay();
}

function getStepIntensity(steps, goal) {
  if (steps <= 0) return 0;
  if (steps < goal * 0.4) return 1;
  if (steps < goal * 0.75) return 2;
  return 3;
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

function readNumericValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return Math.round(parsed);
    }
  }

  return null;
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatMonthLabel(value) {
  if (!value) {
    return "This month";
  }

  const monthKey = value.slice(0, 7);
  const [year, month] = monthKey.split("-").map(Number);

  if (!year || !month) {
    return "This month";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

function formatUpdatedAt(value) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
