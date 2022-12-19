import React, { FunctionComponent, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { StyledDatePickerContainer, StyledErrorMessage, StyledFact } from "./calendarStyles";

interface Props {
  startDate: Date;
}

const Calendar: FunctionComponent<Props> = ({ startDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(startDate);
  const [factData, setFactData] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function fetchFact(month: number, day: number) {
    try {
      const endpoint = `http://numbersapi.com/${month}/${day}/date`;
      const response = await axios.get(endpoint);
      setErrorMessage("");
      setFactData(response.data.toString());
    } catch (error) {
      const ErrorMessage: string = "There was an error retrieving the fact. Please try again later.";
      setErrorMessage(ErrorMessage);
      setFactData("");
      throw new Error(ErrorMessage);
    }
  }

  function debounce(fn: (date: Date) => void, delay: number) {
    let timeoutId: NodeJS.Timeout;
    return function (date: Date) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(date);
      }, delay);
    };
  }

  function onDateChange(date: Date) {
    // Check if the new date is the same as the current selected date
    if (date === selectedDate) {
      return;
    }
    setSelectedDate(date);
    setFactData("");

    const month = date.getMonth() + 1;
    const day = date.getDate();
    fetchFact(month, day);
  }

  return (
    <>
      <StyledDatePickerContainer>
        <h2>Fun facts</h2>
        <DatePicker
          popperPlacement="bottom-start"
          selected={selectedDate}
          onChange={debounce(onDateChange, 500)}
          dateFormat="dd/MM/yyyy"
        />
        {errorMessage && <StyledErrorMessage data-cy="factError">{errorMessage}</StyledErrorMessage>}
      </StyledDatePickerContainer>
      <StyledFact data-cy="factText">{factData}</StyledFact>
    </>
  );
};

export default Calendar;
