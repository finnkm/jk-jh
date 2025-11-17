import React from "react";
import { differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CountUp } from "../ui/countUp";

const FIXED_DATE = new Date(import.meta.env.VITE_WEDDING_DATE);
const DAYS_LEFT = differenceInDays(FIXED_DATE, new Date());

export const CalendarSection: React.FC = () => {
  return (
    <section className="w-full flex items-center justify-center flex-col gap-7 bg-primary/5 py-10">
      <div className="flex flex-col items-center gap-2">
        <p className="font-default-bold text-xl ">2026. 4. 18</p>
        <p className="text-xs">토요일 오후 4시</p>
      </div>
      <div className="h-px w-4/5 bg-gray-300" />
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
        selected={FIXED_DATE}
        onSelect={() => {}}
        defaultMonth={FIXED_DATE}
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
      <div className="h-px w-4/5 bg-gray-300" />
      <p>
        재권 ❤️ 지현의 결혼식이 <CountUp from={0} to={DAYS_LEFT} />일 남았습니다.
      </p>
    </section>
  );
};
