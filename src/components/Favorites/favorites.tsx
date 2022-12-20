import React, { FunctionComponent } from "react";
import { StyledButtonContainer } from "../commonStyles";
import { StyledFavoriteFactsContainer } from "./favoritesStyles";

interface Props {
  facts: string[];
  closeList: () => void;
  clearFavorites: () => void;
}

const Favorites: FunctionComponent<Props> = ({ facts, closeList, clearFavorites }) => {
  return (
    <StyledFavoriteFactsContainer data-cy="favoritesContainer">
      <h2>Favorite Facts</h2>
      {facts.length > 0 ? (
        <ul>
          {facts.map((fact, index) => (
            <li key={index}>{fact}</li>
          ))}
        </ul>
      ) : (
        <p>No favorites found</p>
      )}
      <StyledButtonContainer>
        <button onClick={clearFavorites}>Clear favorites</button>
        <button onClick={closeList}>Close</button>
      </StyledButtonContainer>
    </StyledFavoriteFactsContainer>
  );
};

export default Favorites;
