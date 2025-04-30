import { DATA_MAX_DATE, getIncomeData } from "@/lib/data";
import ChartSection from "@/components/charts/chart-section";
import { subDays, subYears } from "date-fns";

interface ChartDataProps {
  tab: string;
  startDate?: string;
  endDate?: string;
}

export default async function ChartData({
  tab,
  startDate,
  endDate,
}: ChartDataProps) {
  const today = new Date(DATA_MAX_DATE);
  today.setHours(23, 59, 59, 999);

  let periodStartDate: Date | undefined;
  let periodEndDate: Date = today;

  switch (tab) {
    case "today":
      periodStartDate = new Date(today);

    case "yesterday":
      periodStartDate = subDays(today, 1);
      periodEndDate = subDays(today, 1);
      break;
    case "month":
      periodStartDate = subDays(today, 30);
      break;
    case "year":
      periodStartDate = subYears(today, 1);
      break;
    case "custom":
      if (startDate) {
        periodStartDate = new Date(startDate);
      }
      if (endDate) {
        periodEndDate = new Date(endDate);
      }
      break;
    default:
      periodStartDate = subDays(today, 30);
  }

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const data = await getIncomeData(
    tab,
    periodStartDate ? formatDateForAPI(periodStartDate) : undefined,
    formatDateForAPI(periodEndDate)
  );

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">
          Нет данных для выбранного периода
        </p>
      </div>
    );
  }

  return (
    <ChartSection
      data={data}
      initialTab={tab}
      initialStartDate={
        periodStartDate ? formatDateForAPI(periodStartDate) : undefined
      }
      initialEndDate={formatDateForAPI(periodEndDate)}
    />
  );
}
