import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PeriodTabs from "@/components/tabs/period-tabs";
import DatePicker from "@/components/date-picker/date-picker";
import { getIncomeData } from "@/lib/data";
import ChartSection from "@/components/charts/chart-section";

type SearchParams = Promise<{
  tab: string;
  startDate: string;
  endDate: string;
}>;

export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { tab, startDate, endDate } = await searchParams;

  const data = await getIncomeData();

  return (
    <div className="p-4">
      <Card className="border-2 shadow-lg">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Доходы</CardTitle>
            <CardDescription>Тренды доходов за разные периоды</CardDescription>
          </div>
          <PeriodTabs />
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-2 min-h-[400px] w-full z-50">
          {tab === "custom" && <DatePicker />}
          {data.length > 0 && (
            <ChartSection
              data={data}
              initialTab={tab}
              initialStartDate={startDate}
              initialEndDate={endDate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
