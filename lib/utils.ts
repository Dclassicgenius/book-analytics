import { clsx, type ClassValue } from "clsx";
import { subDays, format, setDefaultOptions } from "date-fns";
import { twMerge } from "tailwind-merge";
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
