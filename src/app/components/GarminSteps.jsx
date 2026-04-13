"use client";
import { useEffect, useState } from "react";
import BlueLoader from "./BlueLoader";

const REFRESH_INTERVAL_MS = 60 * 60 * 1000;

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
  const hasMonthSteps = typeof steps?.monthSteps === "number";
  const hasMonthGoalDays = typeof steps?.monthGoalDays === "number";
  const monthGoal = steps?.monthGoal ?? 10000;
  const goalProgress = hasGoal
    ? Math.min(100, Math.max(0, (steps.steps / steps.goal) * 100))
    : null;

  return (
    <section className="mt-32 flex flex-col items-center text-center pb-24">
      <h2 className="text-sm uppercase tracking-widest mb-3 text-blue-700 dark:text-blue-400">
        Garmin / Today
      </h2>

      <p className="text-sm max-w-xl mb-10 text-gray-700 dark:text-gray-400">
        Steps walked today and this month, refreshed once every hour.
      </p>

      <div className="w-full max-w-4xl">
        {loading ? (
          <div className="h-[180px] flex items-center justify-center">
            <BlueLoader />
          </div>
        ) : hasSteps ? (
          <div
            className="
              rounded-lg p-6 text-left
              bg-white/80 backdrop-blur-sm
              border border-blue-500/10
              shadow-sm shadow-blue-500/10
              dark:bg-slate-900/80
              dark:border-blue-500/10
              dark:shadow-none
            "
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                  Steps today
                </h3>

                <div className="text-5xl font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                  {formatNumber(steps.steps)}
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 sm:text-right">
                {hasGoal && (
                  <div>
                    Goal:{" "}
                    <span className="tabular-nums">
                      {formatNumber(steps.goal)}
                    </span>
                  </div>
                )}

                {steps.updatedAt && (
                  <div className="text-xs text-gray-500">
                    Updated {formatUpdatedAt(steps.updatedAt)}
                  </div>
                )}
              </div>
            </div>

            {hasGoal && (
              <div className="mt-6">
                <div className="h-2 w-full rounded bg-gray-200 dark:bg-white/10">
                  <div
                    className="h-2 rounded bg-blue-500"
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>{Math.round(goalProgress)}% complete</span>
                  <span>{steps.date}</span>
                </div>
              </div>
            )}

            {(hasMonthSteps || hasMonthGoalDays) && (
              <div className="mt-8 grid gap-6 border-t border-blue-500/10 pt-6 sm:grid-cols-2">
                {hasMonthSteps && (
                  <Metric
                    label="Steps this month"
                    value={formatNumber(steps.monthSteps)}
                    detail={`Since ${steps.monthStart}`}
                  />
                )}

                {hasMonthGoalDays && (
                  <Metric
                    label={`${formatNumber(monthGoal)}+ step days`}
                    value={formatNumber(steps.monthGoalDays)}
                    detail="This month"
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-[180px] flex items-center justify-center text-sm text-gray-400">
            Garmin step data is not available yet.
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value, detail }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
        {label}
      </div>

      <div className="text-3xl font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
        {value}
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-500">{detail}</div>
    </div>
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatUpdatedAt(value) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
