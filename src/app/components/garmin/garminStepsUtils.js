export function buildFullMonthDays(rawDays, goal, todayKey) {
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

export function buildFullYearMonths(rawMonths, todayKey) {
  const year = todayKey?.slice(0, 4);
  const currentMonth = todayKey?.slice(0, 7);

  if (!year || !currentMonth) {
    return [];
  }

  const monthsByKey = new Map(
    (Array.isArray(rawMonths) ? rawMonths : [])
      .filter((month) => month?.month?.startsWith(`${year}-`))
      .map((month) => [month.month, month])
  );

  return Array.from({ length: 12 }, (_, index) => {
    const month = `${year}-${String(index + 1).padStart(2, "0")}`;
    const source = monthsByKey.get(month);
    const future = month > currentMonth;

    return {
      month,
      future,
      isCurrent: month === currentMonth,
      steps: readNumericValue(source?.steps) ?? 0,
      goalDays: readNumericValue(source?.goalDays) ?? 0,
      days:
        readNumericValue(source?.days) ??
        (future ? 0 : getElapsedDaysInMonth(month, todayKey)),
    };
  });
}

function enumerateMonthDates(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return `${monthKey}-${day}`;
  });
}

function getElapsedDaysInMonth(monthKey, todayKey) {
  if (monthKey === todayKey?.slice(0, 7)) {
    return getDayOfMonth(todayKey);
  }

  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function getStepIntensity(steps, goal) {
  if (steps <= 0) return 0;
  if (steps < goal * 0.4) return 1;
  if (steps < goal * 0.75) return 2;
  return 3;
}

export function readNumericValue(value) {
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

export function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDayOfMonth(dateKey) {
  const day = Number(dateKey?.slice(8, 10));
  return Number.isFinite(day) && day > 0 ? day : 0;
}

export function getDayOfYear(dateKey) {
  if (!dateKey) {
    return 0;
  }

  const date = new Date(`${dateKey}T12:00:00`);
  const yearStart = new Date(date.getFullYear(), 0, 1, 12);
  const diff = date.getTime() - yearStart.getTime();

  return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCompactNumber(value) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatMonthLabel(value) {
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

export function formatMonthShortLabel(value) {
  const monthKey = value?.slice(0, 7);
  const [year, month] = (monthKey || "").split("-").map(Number);

  if (!year || !month) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(new Date(year, month - 1, 1));
}

export function formatYearLabel(value) {
  const year = value?.slice(0, 4);
  return /^\d{4}$/.test(year || "") ? year : "This year";
}

export function formatUpdatedAt(value) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
