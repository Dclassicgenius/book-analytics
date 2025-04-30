import { Skeleton } from "@/components/ui/skeleton";
import { CardContent } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import ChartData from "@/components/charts/chart-data";
import PeriodTabs from "@/components/tabs/period-tabs";
import DatePicker from "@/components/date-picker/date-picker";
import { Suspense } from "react";

type SearchParams = Promise<{
  tab: string;
  startDate?: string;
  endDate?: string;
}>;

export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { tab, startDate, endDate } = await searchParams;

  return (
    <Card className=" rounded-none border-none shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Статистика доходов</CardTitle>
          <CardDescription>Тренды доходов за разные периоды</CardDescription>
        </div>
        <PeriodTabs />
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-2 min-h-[400px] w-full z-50">
        {tab === "custom" && <DatePicker />}

        <Suspense
          key={`${tab}-${startDate || ""}-${endDate || ""}`}
          fallback={
            <div className="py-10">
              <Skeleton className="h-8 w-72 mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
              </div>
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
          }
        >
          <ChartData tab={tab} startDate={startDate} endDate={endDate} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
