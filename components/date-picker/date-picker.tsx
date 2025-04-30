"use client";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format, parseISO, subDays } from "date-fns";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { DATA_MAX_DATE, DATA_MIN_DATE } from "@/lib/data";

export default function DatePicker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const minDate = new Date(DATA_MIN_DATE);
  const maxDate = new Date(DATA_MAX_DATE);

  const referenceDate = maxDate;

  const defaultStartDate = format(subDays(referenceDate, 7), "yyyy-MM-dd");
  const defaultEndDate = format(referenceDate, "yyyy-MM-dd");

  const startDateString = searchParams.get("startDate") || defaultStartDate;
  const endDateString = searchParams.get("endDate") || defaultEndDate;

  const handleDateChange = (date: Date | undefined, type: "start" | "end") => {
    const params = new URLSearchParams(searchParams);

    if (date && type === "start") {
      params.set("startDate", format(date, "yyyy-MM-dd"));
      setStartDateOpen(false);
    } else if (date && type === "end") {
      params.set("endDate", format(date, "yyyy-MM-dd"));
      setEndDateOpen(false);
    } else {
      params.delete(type === "start" ? "startDate" : "endDate");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="grid gap-2">
        <Label htmlFor="start-date">Начальная дата</Label>
        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
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
              defaultMonth={parseISO(startDateString)}
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
        <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
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
              defaultMonth={parseISO(endDateString)}
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
