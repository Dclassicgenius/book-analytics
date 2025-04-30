export type DailyIncome = {
  date: Date;
  income: number;
};

export const DATA_MIN_DATE = new Date(2024, 0, 1); // Jan 1, 2024
export const DATA_MAX_DATE = new Date(2024, 11, 31); // Dec 31, 2024

export async function getIncomeData(
  period?: string,
  startDateStr?: string,
  endDateStr?: string
): Promise<DailyIncome[]> {
  const params = new URLSearchParams();

  if (period) {
    params.set("period", period);
  }

  if (startDateStr) {
    params.set("startDate", startDateStr);
  }

  if (endDateStr) {
    params.set("endDate", endDateStr);
  }

  const response = await fetch(
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/api/income?${params.toString()}`
      : `${process.env.API_BASE_URL}/api/income?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch income data");
  }

  const data = await response.json();

  return data.map((item: { date: string; income: number }) => ({
    ...item,
    date: new Date(item.date),
  }));
}
