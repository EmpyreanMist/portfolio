"use client";
import { useEffect, useMemo, useState } from "react";
import BlueLoader from "./BlueLoader";
import GarminMonthCard from "./garmin/GarminMonthCard";
import GarminTodayCard from "./garmin/GarminTodayCard";
import GarminYearCard from "./garmin/GarminYearCard";
import {
  buildFullMonthDays,
  buildFullYearMonths,
  getLocalDateKey,
} from "./garmin/garminStepsUtils";

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
  const monthGoal = steps?.monthGoal ?? DEFAULT_STEP_GOAL;
  const todayKey = steps?.date || getLocalDateKey(new Date());
  const hasMonthSource =
    Array.isArray(steps?.monthDays) || typeof steps?.monthSteps === "number";
  const hasYearSource =
    Array.isArray(steps?.yearMonths) || typeof steps?.yearSteps === "number";

  const monthDays = useMemo(
    () =>
      hasMonthSource
        ? buildFullMonthDays(steps?.monthDays, monthGoal, todayKey)
        : [],
    [hasMonthSource, steps?.monthDays, monthGoal, todayKey]
  );

  const yearMonths = useMemo(
    () => (hasYearSource ? buildFullYearMonths(steps?.yearMonths, todayKey) : []),
    [hasYearSource, steps?.yearMonths, todayKey]
  );

  const monthSteps =
    typeof steps?.monthSteps === "number"
      ? steps.monthSteps
      : monthDays.reduce((sum, day) => sum + (day.steps || 0), 0);

  const monthGoalDays =
    typeof steps?.monthGoalDays === "number"
      ? steps.monthGoalDays
      : monthDays.filter((day) => day.goalMet).length;

  const yearSteps =
    typeof steps?.yearSteps === "number"
      ? steps.yearSteps
      : yearMonths.reduce((sum, month) => sum + (month.steps || 0), 0);

  const yearGoalDays =
    typeof steps?.yearGoalDays === "number"
      ? steps.yearGoalDays
      : yearMonths.reduce((sum, month) => sum + (month.goalDays || 0), 0);

  return (
    <section className="mt-32 flex flex-col items-center pb-24 text-center">
      <h2 className="mb-3 text-sm uppercase tracking-widest text-blue-700 dark:text-blue-400">
        Garmin / Steps
      </h2>

      <p className="mb-10 max-w-xl text-sm text-gray-700 dark:text-gray-400">
        Today, this month and the year so far, refreshed once every hour.
      </p>

      <div className="w-full max-w-5xl">
        {loading ? (
          <div className="flex h-[220px] items-center justify-center">
            <BlueLoader />
          </div>
        ) : hasSteps ? (
          <div className="flex flex-col gap-6 text-left">
            <GarminTodayCard
              date={steps.date}
              goal={steps.goal}
              steps={steps.steps}
              updatedAt={steps.updatedAt}
            />

            {hasMonthSource && (
              <GarminMonthCard
                monthDays={monthDays}
                monthGoal={monthGoal}
                monthGoalDays={monthGoalDays}
                monthSteps={monthSteps}
              />
            )}

            {hasYearSource && (
              <GarminYearCard
                goal={monthGoal}
                todayKey={todayKey}
                yearGoalDays={yearGoalDays}
                yearMonths={yearMonths}
                yearSteps={yearSteps}
              />
            )}
          </div>
        ) : (
          <div className="flex h-[180px] items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-sm text-gray-500 dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-gray-400">
            {steps?.error || "Garmin step data is not available yet."}
          </div>
        )}
      </div>
    </section>
  );
}
