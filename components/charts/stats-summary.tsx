import { DailyIncome } from "@/lib/data";
import {
  calculateChange,
  calculateMedian,
  formatTooltipValue,
} from "@/lib/utils";

interface StatsSummaryProps {
  data: DailyIncome[];
}

export function StatsSummary({ data }: StatsSummaryProps) {
  const incomeValues = data.map((item) => item.income);
  const totalIncome = incomeValues.reduce((sum, value) => sum + value, 0);
  const minIncome = incomeValues.length > 0 ? Math.min(...incomeValues) : 0;
  const maxIncome = incomeValues.length > 0 ? Math.max(...incomeValues) : 0;
  const medianIncome = calculateMedian(incomeValues);
  const change = calculateChange(incomeValues);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-sm">
      <div className="bg-muted/50 p-3 rounded-lg">
        <div className="text-muted-foreground mb-1">Всего</div>
        <div className="font-medium">{formatTooltipValue(totalIncome)}</div>
      </div>
      <div className="bg-muted/50 p-3 rounded-lg">
        <div className="text-muted-foreground mb-1">Минимум</div>
        <div className="font-medium">{formatTooltipValue(minIncome)}</div>
      </div>
      <div className="bg-muted/50 p-3 rounded-lg">
        <div className="text-muted-foreground mb-1">Максимум</div>
        <div className="font-medium">{formatTooltipValue(maxIncome)}</div>
      </div>
      <div className="bg-muted/50 p-3 rounded-lg">
        <div className="text-muted-foreground mb-1">Медиана</div>
        <div className="font-medium">{formatTooltipValue(medianIncome)}</div>
      </div>
      <div className="bg-muted/50 p-3 rounded-lg">
        <div className="text-muted-foreground mb-1">Динамика</div>
        <div
          className={`font-medium flex items-center ${
            change.value > 0
              ? "text-green-500"
              : change.value < 0
              ? "text-red-500"
              : ""
          }`}
        >
          {change.value > 0 ? "↑" : change.value < 0 ? "↓" : ""}
          {formatTooltipValue(Math.abs(change.value))}
          <span className="text-xs ml-1">
            ({change.percentage.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
