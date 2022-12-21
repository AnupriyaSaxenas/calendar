import React, { FunctionComponent, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios, { AxiosResponse } from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { StyledDatePickerContainer, StyledText } from "./calendarStyles";
import Favorites from "../Favorites/favorites";
import { StyledButtonContainer } from "../commonStyles";

type Messages = string | undefined | null;

interface Props {
  startDate: Date;
}

// #region Component
const Calendar: FunctionComponent<Props> = ({ startDate }) => {
  // #region State variables
  const [selectedDate, setSelectedDate] = useState<Date>(startDate);
  const [factData, setFactData] = useState<Messages>();
  const [errorMessage, setErrorMessage] = useState<Messages>();
  const [favoriteFacts, setFavoriteFacts] = useState<string[]>([]);
  const [isFavoritesListOpen, setIsFavoritesListOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<Messages>();
  // #endregion

  // #region Functions
  const fetchFact = async (month: number, day: number): Promise<void> => {
    try {
      const endpoint = `http://numbersapi.com/${month}/${day}/date`;
      const response: AxiosResponse<string> = await axios.get(endpoint);
      setErrorMessage(null);
      setFactData(response.data);
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

  // To handle changes on selecting date
  const onDateChange = (date: Date): void => {
    setSelectedDate(date);
    setFactData(null);
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();
    fetchFact(month, day);
  };

  // To save the fact, update local storage and set success and error messages
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

  // To persist the list on page refresh
  useEffect(() => {
    const storedFavoriteFacts = localStorage.getItem("favoriteFacts");
    if (storedFavoriteFacts) {
      setFavoriteFacts(JSON.parse(storedFavoriteFacts));
    }
  }, []);

  // Takes us back to calendar
  const closeFavoritesList = () => setIsFavoritesListOpen(false);

  // Removes all the currently saved favorites
  const handleClearFavorites = (): void => {
    localStorage.setItem("favoriteFacts", JSON.stringify([]));
    setFavoriteFacts([]);
  };
  // #endregion

  // #region DOM
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
  // #endregion
};

export default Calendar;
// #endregion
