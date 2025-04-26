import { formatTooltipValue } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-card text-card-foreground border border-border shadow-md rounded-md p-3 text-sm">
        <p className="font-medium mb-1">
          {format(new Date(label), "dd MMM yyyy", { locale: ru })}
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.name === "income" ? "Доход" : entry.name}:{" "}
            </span>
            <span className="font-medium">
              {formatTooltipValue(entry.value)} ₽
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
