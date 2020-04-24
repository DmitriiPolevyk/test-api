export function convertMonthToDate(month: number): Date {
  return new Date(Date.now() - 60 * 60 * 24 * (30 * month) * 1000)
}