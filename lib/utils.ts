import { clsx, type ClassValue } from "clsx";
import {
  subDays,
  format,
  startOfDay,
  endOfDay,
  isWithinInterval,
  setDefaultOptions,
} from "date-fns";
import { twMerge } from "tailwind-merge";
import { DailyIncome } from "./data";
import { ru } from "date-fns/locale";

setDefaultOptions({ locale: ru });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeRangeText = (
  selectedTab: string,
  maxDate: Date,
  startDate: Date,
  endDate: Date
) => {
  switch (selectedTab) {
    case "today":
      return `${format(maxDate, "MMMM d, yyyy")} (Сегодня)`;
    case "yesterday":
      return `${format(subDays(maxDate, 1), "MMMM d, yyyy")} (Вчера)`;
    case "month":
      return `Последние 30 дней (${format(
        subDays(maxDate, 30),
        "MMM d"
      )} - ${format(maxDate, "MMM d, yyyy")})`;
    case "year":
      return `Последние 365 дней (${format(
        subDays(maxDate, 365),
        "MMM yyyy"
      )} - ${format(maxDate, "MMM yyyy")})`;
    case "custom":
      return startDate && endDate
        ? `${format(startDate, "dd MMM yyyy")} - ${format(
            endDate,
            "dd MMM yyyy"
          )}`
        : "Выберите даты";
    default:
      return "Последние 30 дней";
  }
};

export const formatTooltipValue = (value: number) => {
  return new Intl.NumberFormat("ru-RU").format(value);
};

export const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

export const calculateChange = (
  values: number[]
): { value: number; percentage: number } => {
  if (values.length < 2) return { value: 0, percentage: 0 };

  const first = values[0];
  const last = values[values.length - 1];
  const change = last - first;
  const percentage = first === 0 ? 0 : (change / first) * 100;

  return { value: change, percentage };
};

export const filterDataByTimeRange = (
  data: DailyIncome[],
  selectedTab: string,
  referenceDate: Date,
  startDate?: Date,
  endDate?: Date
): DailyIncome[] => {
  let start: Date;
  let end: Date;

  switch (selectedTab) {
    case "today":
      start = startOfDay(referenceDate);
      end = endOfDay(referenceDate);
      break;
    case "yesterday":
      start = startOfDay(subDays(referenceDate, 1));
      end = endOfDay(subDays(referenceDate, 1));
      break;
    case "month":
      start = subDays(referenceDate, 30);
      end = referenceDate;
      break;
    case "year":
      start = subDays(referenceDate, 365);
      end = referenceDate;
      break;
    case "custom":
      start = startDate ? startOfDay(startDate) : subDays(referenceDate, 7);
      end = endDate ? endOfDay(endDate) : referenceDate;
      break;
    default:
      start = subDays(referenceDate, 30);
      end = referenceDate;
  }

  return data.filter((item) => {
    const date = new Date(item.date);
    return isWithinInterval(date, { start, end });
  });
};
