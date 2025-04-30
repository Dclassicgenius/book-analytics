import { DATA_MAX_DATE, DATA_MIN_DATE } from "@/lib/data";
import { subDays } from "date-fns";
import { type NextRequest, NextResponse } from "next/server";

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

let fullDataset: { date: string; income: number }[] | null = null;

const getFullDataset = () => {
  if (fullDataset) return fullDataset;

  fullDataset = [];
  const currentDate = new Date(DATA_MIN_DATE);

  while (currentDate <= DATA_MAX_DATE) {
    const dateForData = new Date(currentDate);
    fullDataset.push({
      date: dateForData.toISOString(),
      income: generateDailyIncome(dateForData),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return fullDataset;
};

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get("period") || "month";

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  let startDate: Date;
  let endDate: Date;

  if (startDateParam && endDateParam) {
    startDate = new Date(startDateParam);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(endDateParam);
    endDate.setHours(23, 59, 59, 999);
  } else {
    const today = new Date(DATA_MAX_DATE);
    today.setHours(23, 59, 59, 999);
    endDate = today;

    switch (period) {
      case "today":
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        startDate = subDays(today, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = subDays(today, 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "month":
        startDate = subDays(today, 30);
        break;
      case "year":
        startDate = subDays(today, 365);
        break;
      default:
        startDate = subDays(today, 30);
    }
  }

  try {
    const dataset = getFullDataset();
    const filteredData = dataset.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error("Error generating mock data:", error);
    return NextResponse.json(
      { error: "Failed to generate income data" },
      { status: 500 }
    );
  }
}
