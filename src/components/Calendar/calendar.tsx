import React, { FunctionComponent, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios, { AxiosResponse } from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { StyledDatePickerContainer, StyledText } from "./calendarStyles";
import Favorites from "../Favorites/favorites";
import { StyledButtonContainer } from "../commonStyles";

interface Props {
  startDate: Date;
}

type Messages = string | undefined | null;

const Calendar: FunctionComponent<Props> = ({ startDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(startDate);
  const [factData, setFactData] = useState<Messages>();
  const [errorMessage, setErrorMessage] = useState<Messages>();
  const [favoriteFacts, setFavoriteFacts] = useState<string[]>([]);
  const [isFavoritesListOpen, setIsFavoritesListOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<Messages>();

  const fetchFact = async (month: number, day: number): Promise<void> => {
    try {
      const endpoint = `http://numbersapi.com/${month}/${day}/date`;
      const response: AxiosResponse<string> = await axios.get(endpoint);
      setErrorMessage(null);
      setFactData(response.data.toString());
    } catch (error) {
      const ErrorMessage: string = "There was an error retrieving the fact. Please try again later.";
      setErrorMessage(ErrorMessage);
      setFactData(null);
      throw new Error(ErrorMessage);
    }
  };

  const debounce = (fn: (date: Date) => void, delay: number): ((date: Date) => void) => {
    let timeoutId: NodeJS.Timeout;
    return function (date: Date) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(date);
      }, delay);
    };
  };

  const onDateChange = (date: Date): void => {
    if (date === selectedDate) {
      return;
    }
    setSelectedDate(date);
    setFactData(null);

    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();
    fetchFact(month, day);
  };

  const handleSaveFact = (): void => {
    if ((factData && favoriteFacts.includes(factData)) || !factData) {
      setErrorMessage("Could not save the fact as the fact already exists or no fact is present.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
      return;
    }
    const updatedFavoriteFacts = [...favoriteFacts, factData];
    setFavoriteFacts(updatedFavoriteFacts);
    localStorage.setItem("favoriteFacts", JSON.stringify(updatedFavoriteFacts));
    setSaveSuccessMessage("Saved successfully!");
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 2000);
  };

  useEffect(() => {
    const storedFavoriteFacts = localStorage.getItem("favoriteFacts");
    if (storedFavoriteFacts) {
      setFavoriteFacts(JSON.parse(storedFavoriteFacts));
    }
  }, []);

  const closeFavoritesList = () => setIsFavoritesListOpen(false);

  const handleClearFavorites = (): void => {
    localStorage.setItem("favoriteFacts", JSON.stringify([]));
    setFavoriteFacts([]);
  };

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
