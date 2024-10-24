export function stringToDate(dateString: string): Date {
  const [day, month, year] = dateString.split('/');
  const date = new Date(`${year}-${month}-${day}`);
  return date;
}
