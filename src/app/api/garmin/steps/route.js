import { NextResponse } from "next/server";
import { GarminConnect } from "garmin-connect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CACHE_TTL_MS = 60 * 60 * 1000;
const DEFAULT_TIME_ZONE = "Europe/Stockholm";
const DEFAULT_STEP_GOAL = 10000;
const MAX_GARMIN_DAILY_RANGE_LENGTH = 28;

let cachedSteps = null;
let cachedAt = 0;
let garminClientPromise = null;

export async function GET() {
  const now = Date.now();

  if (cachedSteps && now - cachedAt < CACHE_TTL_MS) {
    return jsonResponse({
      ...cachedSteps,
      cached: true,
    });
  }

  try {
    const timeZone = process.env.GARMIN_STEPS_TIME_ZONE || DEFAULT_TIME_ZONE;
    const nowDate = new Date();
    const today = getDateKey(nowDate, timeZone);
    const monthStart = getMonthStartKey(nowDate, timeZone);
    const normalized = await fetchSteps(today, monthStart);

    if (normalized.configured === false) {
      return jsonResponse(normalized);
    }

    if (typeof normalized.steps !== "number") {
      throw new Error("Garmin steps source did not include steps");
    }

    cachedSteps = {
      configured: true,
      source: normalized.source,
      steps: normalized.steps,
      goal: normalized.goal,
      monthSteps: normalized.monthSteps,
      monthGoalDays: normalized.monthGoalDays,
      monthGoal: normalized.monthGoal || getConfiguredStepGoal(),
      monthDays: normalized.monthDays,
      monthStart,
      date: normalized.date || today,
      updatedAt:
        parseDateTime(normalized.updatedAt) || new Date(now).toISOString(),
    };
    cachedAt = now;

    return jsonResponse(cachedSteps);
  } catch (error) {
    console.error("GARMIN STEPS API ERROR", error);

    if (isGarminLoginError(error)) {
      return jsonResponse(
        {
          configured: true,
          error:
            "Garmin Connect login failed. Check credentials and MFA settings.",
        },
        401
      );
    }

    return jsonResponse(
      {
        configured: true,
        error: "Failed to fetch Garmin step data",
      },
      502
    );
  }
}

async function fetchSteps(today, monthStart) {
  if (hasGarminCredentials()) {
    return fetchGarminConnectSteps(today, monthStart);
  }

  if (process.env.GARMIN_STEPS_ENDPOINT) {
    return fetchEndpointSteps(today, monthStart);
  }

  return {
    configured: false,
    error:
      "Set GARMIN_USERNAME/GARMIN_EMAIL and GARMIN_PASSWORD, or set GARMIN_STEPS_ENDPOINT",
  };
}

async function fetchGarminConnectSteps(today, monthStart) {
  const client = await getGarminClient();
  const domain = getGarminDomain();
  const days = await fetchGarminDailySteps(client, domain, monthStart, today);
  const dayStats = Array.isArray(days)
    ? days.find((entry) => entry.calendarDate === today)
    : null;
  const monthSummary = summarizeMonthlySteps(days, monthStart, today);

  if (dayStats) {
    return {
      source: "garmin-connect",
      steps: readNumber(dayStats, ["totalSteps"]),
      goal: readNumber(dayStats, ["stepGoal"]),
      ...monthSummary,
      date: dayStats.calendarDate || today,
    };
  }

  const steps = await client.getSteps(new Date(`${today}T12:00:00`));

  return {
    source: "garmin-connect",
    steps: Number.isFinite(steps) ? Math.round(steps) : null,
    goal: null,
    ...monthSummary,
    date: today,
  };
}

async function fetchGarminDailySteps(client, domain, startDate, endDate) {
  const ranges = splitDateRange(startDate, endDate);

  if (ranges.length === 1) {
    return client.get(getGarminDailyStepsUrl(domain, startDate, endDate));
  }

  const days = [];

  for (const [rangeStart, rangeEnd] of ranges) {
    const chunk = await client.get(
      getGarminDailyStepsUrl(domain, rangeStart, rangeEnd)
    );

    if (Array.isArray(chunk)) {
      days.push(...chunk);
    }
  }

  return days;
}

function getGarminDailyStepsUrl(domain, startDate, endDate) {
  return `https://connectapi.${domain}/usersummary-service/stats/steps/daily/${startDate}/${endDate}`;
}

async function fetchEndpointSteps(today, monthStart) {
  const res = await fetch(process.env.GARMIN_STEPS_ENDPOINT, {
    headers: buildHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Garmin steps source returned ${res.status}`);
  }

  return {
    source: "endpoint",
    ...normalizeEndpointSteps(await res.json(), today, monthStart),
  };
}

function hasGarminCredentials() {
  return !!(getGarminUsername() && process.env.GARMIN_PASSWORD);
}

async function getGarminClient() {
  if (!garminClientPromise) {
    garminClientPromise = loginGarminClient();
  }

  try {
    return await garminClientPromise;
  } catch (error) {
    garminClientPromise = null;
    throw error;
  }
}

async function loginGarminClient() {
  const client = new GarminConnect(
    {
      username: getGarminUsername(),
      password: process.env.GARMIN_PASSWORD,
    },
    getGarminDomain()
  );

  await client.login();
  return client;
}

function getGarminUsername() {
  return process.env.GARMIN_USERNAME || process.env.GARMIN_EMAIL;
}

function getGarminDomain() {
  return process.env.GARMIN_DOMAIN === "garmin.cn" ? "garmin.cn" : "garmin.com";
}

function buildHeaders() {
  const headers = {
    Accept: "application/json",
  };

  if (process.env.GARMIN_STEPS_BEARER_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GARMIN_STEPS_BEARER_TOKEN}`;
  }

  if (process.env.GARMIN_STEPS_API_KEY) {
    headers[process.env.GARMIN_STEPS_API_KEY_HEADER || "x-api-key"] =
      process.env.GARMIN_STEPS_API_KEY;
  }

  return headers;
}

function normalizeEndpointSteps(data, today, monthStart) {
  return {
    ...normalizeSteps(data, today),
    ...normalizeMonthlySteps(data, monthStart, today),
  };
}

function normalizeSteps(data, today) {
  if (!data) return {};

  if (Array.isArray(data)) {
    const matchingEntry = data.find((entry) => getDateValue(entry) === today);
    return normalizeSteps(matchingEntry || data[0], today);
  }

  if (data.data) {
    return normalizeSteps(data.data, today);
  }

  const dailySummary =
    data.dailySummaries ||
    data.userDailySummaries ||
    data.summaries ||
    data.dailies;

  if (dailySummary) {
    return normalizeSteps(dailySummary, today);
  }

  const metrics = data.metricsMap || data.userMetrics?.metricsMap;
  const stepsMetric = metrics?.WELLNESS_TOTAL_STEPS;

  if (Array.isArray(stepsMetric)) {
    const stepsEntry =
      stepsMetric.find((entry) => getDateValue(entry) === today) ||
      stepsMetric[0];
    const goalMetric = metrics.WELLNESS_TOTAL_STEP_GOAL;
    const goalEntry = Array.isArray(goalMetric)
      ? goalMetric.find(
          (entry) => getDateValue(entry) === getDateValue(stepsEntry)
        )
      : null;

    return {
      steps: readNumber(stepsEntry, ["value"]),
      goal: readNumber(goalEntry, ["value"]),
      date: getDateValue(stepsEntry),
      updatedAt: readString(data, ["updatedAt", "lastUpdated"]),
    };
  }

  return {
    steps: readNumber(data, [
      "steps",
      "Steps",
      "stepCount",
      "totalSteps",
      "TotalSteps",
      "value",
    ]),
    goal: readNumber(data, [
      "goal",
      "stepsGoal",
      "StepsGoal",
      "dailyStepGoal",
      "stepGoal",
    ]),
    date: getDateValue(data),
    updatedAt: readString(data, ["updatedAt", "lastUpdated", "LastUpdated"]),
  };
}

function normalizeMonthlySteps(data, monthStart, today) {
  if (!data) return {};

  if (Array.isArray(data)) {
    return summarizeMonthlySteps(data, monthStart, today);
  }

  if (data.data) {
    return normalizeMonthlySteps(data.data, monthStart, today);
  }

  const dailySummary =
    data.dailySummaries ||
    data.userDailySummaries ||
    data.summaries ||
    data.dailies;

  if (dailySummary) {
    return normalizeMonthlySteps(dailySummary, monthStart, today);
  }

  const monthGoal = readNumber(data, ["monthGoal", "monthlyGoal"]);
  const monthDays = normalizeMonthDays(data.monthDays || data.monthlyDays);

  return {
    monthSteps: readNumber(data, [
      "monthSteps",
      "monthlySteps",
      "stepsThisMonth",
      "totalStepsThisMonth",
    ]),
    monthGoalDays: readNumber(data, [
      "monthGoalDays",
      "monthlyGoalDays",
      "goalDaysThisMonth",
      "daysGoalMetThisMonth",
      "daysOverStepGoal",
    ]),
    monthGoal: monthGoal || getConfiguredStepGoal(),
    monthDays,
  };
}

function summarizeMonthlySteps(days, monthStart, today) {
  if (!Array.isArray(days)) {
    return {
      monthSteps: null,
      monthGoalDays: null,
      monthGoal: getConfiguredStepGoal(),
      monthDays: null,
    };
  }

  const monthGoal = getConfiguredStepGoal();
  const stepsByDate = new Map();

  for (const entry of days) {
    const date = getDateValue(entry);
    const steps = readNumber(entry, [
      "totalSteps",
      "steps",
      "Steps",
      "stepCount",
    ]);

    if (date && typeof steps === "number") {
      stepsByDate.set(date, steps);
    }
  }

  const monthDays = enumerateDateKeys(monthStart, today).map((date) => {
    const steps = stepsByDate.get(date) ?? 0;

    return {
      date,
      steps,
      goalMet: steps >= monthGoal,
      intensity: getStepIntensity(steps, monthGoal),
    };
  });

  return {
    monthSteps: monthDays.reduce((sum, day) => sum + day.steps, 0),
    monthGoalDays: monthDays.filter((day) => day.goalMet).length,
    monthGoal,
    monthDays,
  };
}

function normalizeMonthDays(days) {
  if (!Array.isArray(days)) {
    return null;
  }

  const monthGoal = getConfiguredStepGoal();

  return days
    .map((day) => {
      const date = getDateValue(day);
      const steps = readNumber(day, [
        "steps",
        "Steps",
        "totalSteps",
        "stepCount",
      ]);

      if (!date || typeof steps !== "number") {
        return null;
      }

      return {
        date,
        steps,
        goalMet: steps >= monthGoal,
        intensity: getStepIntensity(steps, monthGoal),
      };
    })
    .filter(Boolean);
}

function getStepIntensity(steps, goal) {
  if (steps <= 0) return 0;
  if (steps < goal * 0.4) return 1;
  if (steps < goal * 0.7) return 2;
  if (steps < goal) return 3;
  return 4;
}

function readNumber(source, keys) {
  if (!source) return null;

  for (const key of keys) {
    const value = source[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.round(value);
    }

    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        return Math.round(parsed);
      }
    }
  }

  return null;
}

function readString(source, keys) {
  if (!source) return null;

  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }

  return null;
}

function getDateValue(source) {
  return readString(source, [
    "date",
    "calendarDate",
    "CalendarDate",
    "summaryDate",
  ]);
}

function getDateKey(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function getMonthStartKey(date, timeZone) {
  const today = getDateKey(date, timeZone);
  return `${today.slice(0, 8)}01`;
}

function enumerateDateKeys(start, end) {
  if (!start || !end) {
    return [];
  }

  const dates = [];
  const current = parseDateKey(start);
  const last = parseDateKey(end);

  while (current <= last) {
    dates.push(formatDateKey(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

function splitDateRange(start, end) {
  if (!start || !end) {
    return [];
  }

  const ranges = [];
  let rangeStart = parseDateKey(start);
  const last = parseDateKey(end);

  while (rangeStart <= last) {
    const rangeEnd = new Date(rangeStart.getTime());
    rangeEnd.setUTCDate(
      rangeEnd.getUTCDate() + MAX_GARMIN_DAILY_RANGE_LENGTH - 1
    );

    if (rangeEnd > last) {
      rangeEnd.setTime(last.getTime());
    }

    ranges.push([formatDateKey(rangeStart), formatDateKey(rangeEnd)]);

    rangeStart = new Date(rangeEnd.getTime());
    rangeStart.setUTCDate(rangeStart.getUTCDate() + 1);
  }

  return ranges;
}

function parseDateKey(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function formatDateKey(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getConfiguredStepGoal() {
  const goal = Number(process.env.GARMIN_STEPS_GOAL);

  if (Number.isFinite(goal) && goal > 0) {
    return Math.round(goal);
  }

  return DEFAULT_STEP_GOAL;
}

function parseDateTime(value) {
  if (!value) return null;

  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return new Date(timestamp).toISOString();
}

function isGarminLoginError(error) {
  return (
    error instanceof Error &&
    /login failed|ticket not found|mfa/i.test(error.message)
  );
}

function jsonResponse(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, max-age=0, s-maxage=0",
    },
  });
}
