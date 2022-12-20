import React, { FunctionComponent, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { StyledDatePickerContainer, StyledText } from "./calendarStyles";
import Favorites from "../Favorites/favorites";
import { StyledButtonContainer } from "../commonStyles";

interface Props {
  startDate: Date;
}

const Calendar: FunctionComponent<Props> = ({ startDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(startDate);
  const [factData, setFactData] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [favoriteFacts, setFavoriteFacts] = useState<string[]>([]);
  const [isFavoritesListOpen, setIsFavoritesListOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | undefined>();

  async function fetchFact(month: number, day: number) {
    try {
      const endpoint = `http://numbersapi.com/${month}/${day}/date`;
      const response = await axios.get(endpoint);
      setErrorMessage(undefined);
      setFactData(response.data.toString());
    } catch (error) {
      const ErrorMessage: string = "There was an error retrieving the fact. Please try again later.";
      setErrorMessage(ErrorMessage);
      setFactData(undefined);
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
    if (date === selectedDate) {
      return;
    }
    setSelectedDate(date);
    setFactData(undefined);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    fetchFact(month, day);
  }

  function handleSaveFact() {
    if ((factData && favoriteFacts.includes(factData)) || !factData) {
      setErrorMessage("Could not save the fact as the fact already exists or no fact is present.");
      setTimeout(() => {
        setErrorMessage(undefined);
      }, 2000);
      return;
    }
    const updatedFavoriteFacts = [...favoriteFacts, factData];
    setFavoriteFacts(updatedFavoriteFacts);
    localStorage.setItem("favoriteFacts", JSON.stringify(updatedFavoriteFacts));
    setSaveSuccessMessage("Saved successfully!");
    setTimeout(() => {
      setSaveSuccessMessage(undefined);
    }, 2000);
  }

  useEffect(() => {
    const storedFavoriteFacts = localStorage.getItem("favoriteFacts");
    if (storedFavoriteFacts) {
      setFavoriteFacts(JSON.parse(storedFavoriteFacts));
    }
  }, []);

  const closeFavoritesList = () => setIsFavoritesListOpen(false);

  function handleClearFavorites() {
    localStorage.setItem("favoriteFacts", JSON.stringify([]));
    setFavoriteFacts([]);
  }

  return (
    <>
      {isFavoritesListOpen ? (
        <Favorites facts={favoriteFacts} closeList={closeFavoritesList} clearFavorites={handleClearFavorites} />
      ) : (
        <>
          <StyledDatePickerContainer>
            <h2>Fun facts</h2>
            <DatePicker
              popperPlacement="bottom-start"
              selected={selectedDate}
              onChange={debounce(onDateChange, 500)}
              dateFormat="dd/MM/yyyy"
            />
          </StyledDatePickerContainer>
          {factData && <StyledText data-cy="factText">{factData}</StyledText>}
          {errorMessage && <StyledText data-cy="factError">{errorMessage}</StyledText>}
          {saveSuccessMessage && <StyledText data-cy="factSaveSuccess">{saveSuccessMessage}</StyledText>}
          <StyledButtonContainer>
            <button onClick={() => handleSaveFact()}>Save Fact</button>
            <button onClick={() => setIsFavoritesListOpen(true)}>View Favorites</button>
          </StyledButtonContainer>
        </>
      )}
    </>
  );
};

export default Calendar;
