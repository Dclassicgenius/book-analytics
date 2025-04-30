"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { DailyIncome } from "@/lib/data";
import { formatTooltipValue, getTimeRangeText } from "@/lib/utils";
import { CustomTooltip } from "./custom-tooltip";
import { StatsSummary } from "./stats-summary";

const chartConfig = {
  income: {
    label: "Доход Книги",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface ChartSectionProps {
  data: DailyIncome[];
  initialTab?: string;
  initialStartDate?: string;
  initialEndDate?: string;
}

export default function ChartSection({
  data,
  initialTab = "month",
  initialStartDate,
  initialEndDate,
}: ChartSectionProps) {
  const dateObjects = data.map((item) => item.date);
  const maxDate = new Date(
    Math.max(...dateObjects.map((date) => new Date(date).getTime()))
  );

  const maxValue = Math.max(...data.map((item) => item.income)) * 1.2;

  const selectedTab = initialTab;
  const startDate = initialStartDate
    ? parseISO(initialStartDate)
    : subDays(maxDate, 7);
  const endDate = initialEndDate ? parseISO(initialEndDate) : maxDate;

  const useBarChart =
    selectedTab === "today" || selectedTab === "yesterday" || data.length <= 3;

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="px-0 pt-0">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          {getTimeRangeText(selectedTab, maxDate, startDate, endDate)}
        </h3>

        <StatsSummary data={data} />

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[400px] w-full"
        >
          {data.length > 0 ? (
            useBarChart ? (
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  tick={{ fill: "var(--muted-foreground)" }}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date =
                      typeof value === "string"
                        ? parseISO(value)
                        : new Date(value);
                    return format(
                      date,
                      selectedTab === "year" ? "MMM" : "dd MMM",
                      { locale: ru }
                    );
                  }}
                  label={{
                    value: "Дата",
                    position: "insideBottom",
                    offset: -10,
                    style: {
                      textAnchor: "middle",
                      fill: "var(--foreground)",
                    },
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  tick={{ fill: "var(--muted-foreground)" }}
                  tickMargin={15}
                  domain={[0, maxValue]}
                  tickFormatter={(value) => formatTooltipValue(value)}
                  label={{
                    value: "Доход (₽)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -12,
                    style: {
                      textAnchor: "middle",
                      fill: "var(--foreground)",
                      dy: "-4em",
                    },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="income"
                  fill="var(--primary)"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  radius={[4, 4, 0, 0]}
                  className="dark:fill-white dark:stroke-white"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            ) : (
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient
                    id="incomeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  tick={{ fill: "var(--muted-foreground)" }}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date =
                      typeof value === "string"
                        ? parseISO(value)
                        : new Date(value);
                    return format(
                      date,
                      selectedTab === "year" ? "MMM" : "dd MMM",
                      { locale: ru }
                    );
                  }}
                  label={{
                    value: "Дата",
                    position: "insideBottom",
                    offset: -10,
                    style: {
                      textAnchor: "middle",
                      fill: "var(--foreground)",
                    },
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  tick={{ fill: "var(--muted-foreground)" }}
                  tickMargin={15}
                  domain={[0, "dataMax + 100"]}
                  tickFormatter={(value) => formatTooltipValue(value)}
                  label={{
                    value: "Доход (₽)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -12,
                    style: {
                      textAnchor: "middle",
                      fill: "var(--foreground)",
                      dy: "-4em",
                    },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  dataKey="income"
                  fill="url(#incomeGradient)"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  name="income"
                  activeDot={{
                    r: 6,
                    fill: "var(--primary)",
                    className: "dark:fill-white",
                  }}
                  className="dark:stroke-white"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            )
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                Нет данных для выбранного периода
              </p>
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
