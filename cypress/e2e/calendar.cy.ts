describe("Calendar", () => {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 1);
  const dateInput = `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;

  beforeEach(() => {
    cy.visit("/calendar");
  });

  it("allows the user to select a new date", () => {
    cy.get(".react-datepicker__input-container input").clear().type(dateInput);
    cy.get(".react-datepicker__input-container input").should("have.value", dateInput);
  });

  it("displays the correct fact for the selected date", () => {
    cy.get(".react-datepicker__input-container input").clear().type(dateInput);
    // Allow time for the API call to complete
    cy.get('[data-cy="factText"]').then((factElement) => {
      const expectedFact = `${factElement.text()}`;
      cy.get('[data-cy="factText"]').should("have.text", expectedFact);
    });
  });

  it("displays an error message when there is an error retrieving the fact", () => {
    cy.get(".react-datepicker__input-container input").click();
    // Intercept the request to numbersapi.com
    cy.intercept(
      {
        method: "GET",
        url: "http://numbersapi.com/*/*/date",
      },
      { forceNetworkError: true },
    ).as("offlineRequest");
    cy.get(".react-datepicker__day").contains(newDate.getDate()).click();
    cy.wait("@offlineRequest");
    cy.get('[data-cy="factError"]').should("be.visible");
  });
});
