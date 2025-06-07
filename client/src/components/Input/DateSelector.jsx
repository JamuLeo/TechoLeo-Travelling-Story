import React, { useState } from 'react';  // Importing useState
import { DayPicker } from "react-day-picker";  // Using DayPicker instead of DatePicker
import moment from "moment";
import { MdOutlineDateRange, MdClose } from "react-icons/md";

const DateSelector = ({ date, setDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false); // useState for openDatePicker

  return (
    <div>
      <button 
        className="inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/60 hover:bg-sky-200/20 rounded px-2 py-1 cursor-pointer" 
        onClick={() => setOpenDatePicker(true)}
      >
        <MdOutlineDateRange className="text-lg" />
        {date
          ? moment(date).format("Do  MMM YYYY")  // Fixed date format
          : moment().format("Do MMM YYYY")}
      </button>

      {openDatePicker && (
        <div className="overflow-y-scroll p-5 bg-sky-50/80 rounded-lg relative pt-9">
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-100 absolute top-2 right-2"
            onClick={() => setOpenDatePicker(false)}
          > 
            <MdClose className="text-xl text-sky-400" />
          </button>  

          <DayPicker  // Using DayPicker instead of DatePicker
            captionLayout="dropdown-buttons"
            mode="single"
            selected={date}
            onSelect={setDate}
            pageNavigation
          />
        </div>
      )}
    </div>
  );
};

export default DateSelector;
