import styled from "styled-components";

export const StyledDatePickerContainer = styled.div`
  width: 15%;
  margin: 0 auto;
  text-align: center;

  .react-datepicker__input-container input {
    display: block;
    width: 100% !important;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day:hover {
    border-radius: 1rem;
  }

  .react-datepicker__header {
    background-color: #fff;
  }
  .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::after {
    border-bottom-color: #fff;
  }
`;

export const StyledErrorMessage = styled.div`
  color: #b80003;
  padding: 1rem 0;
`;

export const StyledFact = styled.div`
  width: 30%;
  margin: 0 auto;
  color: #424242;
  padding: 1rem 0;
`;

export {};
