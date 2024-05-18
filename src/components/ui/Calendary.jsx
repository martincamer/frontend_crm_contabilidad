import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const header = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth}>
          <CiCircleChevLeft className="h-7 w-6 text-blue-600" />
        </button>
        <h2 className="text-sm font-semibold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button onClick={nextMonth}>
          <CiCircleChevRight className="h-7 w-6 text-blue-600" />
        </button>
      </div>
    );
  };

  const daysOfWeek = () => {
    const dateFormat = "EEEE";
    const days = [];
    let startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-xs font-medium text-gray-600">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-2">{days}</div>;
  };

  const daysOfMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(
          <div className="flex items-center justify-center" key={day}>
            <p
              className={`py-1.5 px-2 text-xs font-medium text-center ${
                !isSameMonth(day, monthStart)
                  ? "text-gray-400"
                  : isSameDay(day, new Date())
                  ? "bg-blue-500 text-white rounded-full"
                  : "text-gray-800"
              }`}
            >
              {format(day, dateFormat)}
            </p>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-2">
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white">
      {header()}
      {daysOfWeek()}
      {daysOfMonth()}
    </div>
  );
};

export default Calendar;
