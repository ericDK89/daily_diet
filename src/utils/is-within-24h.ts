export const isWithin24h = (date1: string, date2: string): boolean => {
  const diff = Number(new Date(date1)) - Number(new Date(date2))
  const hours = diff / (1000 * 60 * 60)
  return hours < 24
}
