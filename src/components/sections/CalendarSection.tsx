import React from "react";
import { Calendar } from "../ui/calendar";

export const CalendarSection: React.FC = () => {
  const fixedDate = new Date(import.meta.env.VITE_WEDDING_DATE);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Calendar
        mode="single"
        defaultMonth={fixedDate}
        selected={fixedDate}
        onSelect={() => {}}
        showOutsideDays={false}
        className="w-full max-w-sm [&_button]:hover:!bg-transparent [&_button]:focus:!bg-transparent [&_button[data-selected-single='true']]:!bg-primary [&_button[data-selected-single='true']]:!text-primary-foreground [&_button[data-selected-single='true']]:hover:!bg-primary [&_button[data-selected-single='true']]:focus:!bg-primary"
        classNames={{
          nav: "hidden",
          month_caption: "hidden",
          weekdays: "flex gap-0",
          weekday: "[&:first-child]:text-red-500 flex-1 text-center",
        }}
        modifiers={{
          sunday: (date) => date.getDay() === 0,
          notSelected: (date) => date.getTime() !== fixedDate.getTime(),
        }}
        modifiersClassNames={{
          sunday:
            "text-red-500 hover:!text-red-500 focus:!text-red-500 [&>button]:hover:!text-red-500 [&>button]:focus:!text-red-500", // 일요일 텍스트 호버 시에도 빨간색 유지
          notSelected:
            "hover:!bg-transparent focus:!bg-transparent focus:!ring-0 focus:!border-0 focus:!outline-none [&>button]:hover:!bg-transparent [&>button]:focus:!bg-transparent [&>button]:focus:!ring-0 [&>button]:focus:!border-0 [&>button]:focus:!outline-none",
        }}
      />
    </div>
  );
};
