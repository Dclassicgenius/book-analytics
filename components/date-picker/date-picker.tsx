"use client";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format, parseISO, subDays } from "date-fns";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DatePicker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const minDate = new Date(2024, 0, 1);
  const maxDate = new Date(2024, 11, 31);

  const referenceDate = maxDate;

  const defaultStartDate = format(subDays(referenceDate, 7), "yyyy-MM-dd");
  const defaultEndDate = format(referenceDate, "yyyy-MM-dd");

  const startDateString = searchParams.get("startDate") || defaultStartDate;
  const endDateString = searchParams.get("endDate") || defaultEndDate;

  useEffect(() => {
    if (!searchParams.has("startDate") || !searchParams.has("endDate")) {
      const params = new URLSearchParams(searchParams);

      if (!searchParams.has("startDate")) {
        params.set("startDate", defaultStartDate);
      }

      if (!searchParams.has("endDate")) {
        params.set("endDate", defaultEndDate);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [pathname, router, searchParams, defaultStartDate, defaultEndDate]);

  const handleDateChange = (date: Date | undefined, type: "start" | "end") => {
    const params = new URLSearchParams(searchParams);

    if (date && type === "start") {
      params.set("startDate", format(date, "yyyy-MM-dd"));
    } else if (date && type === "end") {
      params.set("endDate", format(date, "yyyy-MM-dd"));
    } else {
      params.delete(type === "start" ? "startDate" : "endDate");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="grid gap-2">
        <Label htmlFor="start-date">Начальная дата</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="start-date"
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !startDateString && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDateString ? (
                format(parseISO(startDateString), "PPP")
              ) : (
                <span>Выберите дату</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={parseISO(startDateString)}
              onSelect={(date) => handleDateChange(date, "start")}
              initialFocus
              disabled={(date) =>
                date > parseISO(endDateString) ||
                date < minDate ||
                date > maxDate
              }
              fromDate={minDate}
              toDate={maxDate}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="end-date">Конечная дата</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="end-date"
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !endDateString && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDateString ? (
                format(parseISO(endDateString), "PPP")
              ) : (
                <span>Выберите дату</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={parseISO(endDateString)}
              onSelect={(date) => handleDateChange(date, "end")}
              initialFocus
              disabled={(date) =>
                date < parseISO(startDateString) ||
                date < minDate ||
                date > maxDate
              }
              fromDate={minDate}
              toDate={maxDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
