import React from "react";
import { ko } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export const CalendarSection: React.FC = () => {
  const fixedDate = new Date(import.meta.env.VITE_WEDDING_DATE);

  return (
    <div className="w-full flex items-center justify-center flex-col gap-7 bg-gray-50 pt-10 pb-10">
      <div className="flex flex-col items-center gap-2">
        <p className="font-default-bold text-xl ">2026. 4. 18</p>
        <p className="text-xs">토요일 오후 4시</p>
      </div>
      <div className="h-px w-3/4 bg-gray-300" />
      <style>{`
        .calendar-custom .rdp-root {
          --rdp-accent-color: hsl(0 0% 9%);
          --rdp-accent-background-color: hsl(0 0% 9%);
          --rdp-day-width: 40px;
          --rdp-day-height: 40px;
          --rdp-day_button-width: 40px;
          --rdp-day_button-height: 40px;
          --rdp-day_button-border-radius: 50%;
          --rdp-nav-height: 0px;
        }
        .calendar-custom .rdp-weekday:first-child {
          color: rgb(239 68 68);
        }
      `}</style>
      <DayPicker
        mode="single"
        selected={fixedDate}
        onSelect={() => {}}
        defaultMonth={fixedDate}
        locale={ko}
        showOutsideDays={false}
        className="calendar-custom"
        classNames={{
          nav: "hidden",
          month_caption: "hidden",
          button_previous: "hidden",
          button_next: "hidden",
          day_button: "cursor-default hover:bg-transparent focus:bg-transparent focus:outline-none",
        }}
        modifiers={{
          sunday: (date) => date.getDay() === 0,
        }}
        modifiersClassNames={{
          sunday: "text-red-500",
          selected: "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary",
        }}
      />
      <div className="h-px w-3/4 bg-gray-300" />
      <p>
        재권 ❤️ 지현의 결혼식이 {Math.ceil((fixedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}일 남았습니다.
      </p>
    </div>
  );
};
