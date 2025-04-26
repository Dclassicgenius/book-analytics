export type DailyIncome = {
  date: Date;
  income: number;
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateDailyIncome = (date: Date): number => {
  const daySeed = date.getDate() + date.getMonth() * 31;

  let baseIncome = 15000 + seededRandom(daySeed) * 10000;

  if (date.getDay() === 0 || date.getDay() === 6) {
    baseIncome *= 1.4 + seededRandom(daySeed + 1000) * 0.2;
  }

  const month = date.getMonth();
  if (month === 8) {
    baseIncome *= 1.5;
  } else if (month === 11) {
    baseIncome *= 1.7;
  } else if (month === 6 || month === 7) {
    baseIncome *= 1.3;
  } else if (month === 1) {
    baseIncome *= 0.8;
  }

  return Math.round(baseIncome * (0.9 + seededRandom(daySeed + 2000) * 0.2));
};

export async function getIncomeData(
  startDate: Date = new Date(2024, 0, 1),
  endDate: Date = new Date(2024, 11, 31)
): Promise<DailyIncome[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const data: DailyIncome[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    data.push({
      date: new Date(currentDate),
      income: generateDailyIncome(currentDate),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}
