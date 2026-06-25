export function dateOnly(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function getDailyRange() {
  const today = dateOnly(new Date());

  return {
    label: today,
    from: `${today}T00:00:00`,
    to: `${today}T23:59:59`,
  };
}

export function getWeeklyRange() {
  const now = new Date();
  const fromDate = new Date(now);
  fromDate.setDate(now.getDate() - 7);

  return {
    label: `${dateOnly(fromDate)} — ${dateOnly(now)}`,
    from: `${dateOnly(fromDate)}T00:00:00`,
    to: `${dateOnly(now)}T23:59:59`,
  };
}

export function getMonthlyRange() {
  const now = new Date();
  const fromDate = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    label: `${dateOnly(fromDate)} — ${dateOnly(now)}`,
    from: `${dateOnly(fromDate)}T00:00:00`,
    to: `${dateOnly(now)}T23:59:59`,
  };
}