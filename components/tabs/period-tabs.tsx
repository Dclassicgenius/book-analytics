"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect } from "react";

const tabs = [
  { value: "today", label: "Сегодня" },
  { value: "yesterday", label: "Вчера" },
  { value: "month", label: "Месяц" },
  { value: "year", label: "Год" },
  { value: "custom", label: "Даты" },
];

export default function PeriodTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedTab = searchParams.get("tab") || "month";

  useEffect(() => {
    if (!searchParams.has("tab")) {
      const params = new URLSearchParams(searchParams);
      params.set("tab", "month");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [pathname, router, searchParams]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);

    if (value !== "custom") {
      params.delete("startDate");
      params.delete("endDate");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs
      value={selectedTab}
      onValueChange={handleTabChange}
      className="w-full sm:w-auto"
    >
      <TabsList className="grid w-full grid-cols-5 sm:w-auto">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
