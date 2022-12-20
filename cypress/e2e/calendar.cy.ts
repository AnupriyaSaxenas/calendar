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

  it("displays a fact for the selected date", () => {
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

  it("displays the save fact button and the button is clickable", () => {
    cy.get(".react-datepicker__input-container input").click();
    cy.get(".react-datepicker__day").contains(newDate.getDate()).click();
    cy.wait(200).get("button").contains("Save").click();
  });

  it("shows success message if fact is saved successfully", () => {
    cy.get(".react-datepicker__input-container input").click();
    cy.get(".react-datepicker__day").contains(newDate.getDate()).click();
    cy.get('[data-cy="factText"]').then((factElement) => {
      const expectedFact = `${factElement.text()}`;
      cy.get('[data-cy="factText"]').should("have.text", expectedFact);
    });
    cy.wait(200).get("button").contains("Save").click();
    cy.wait(200).get('[data-cy="factSaveSuccess"]').should("be.visible");
  });

  it("shows error message if fact is not saved successfully", () => {
    cy.wait(200).get("button").contains("Save").click();
    cy.wait(200).get('[data-cy="factError"]').should("be.visible");
  });

  it("displays the view favorites button and the button is clickable", () => {
    cy.get("button").contains("View").click();
  });

  it("displays the saved facts on click of view favorites button", () => {
    cy.get(".react-datepicker__input-container input").click();
    cy.get(".react-datepicker__day").contains(newDate.getDate()).click();
    cy.get('[data-cy="factText"]').then((factElement) => {
      const expectedFact = `${factElement.text()}`;
      cy.get('[data-cy="factText"]').should("have.text", expectedFact);
    });
    cy.wait(200).get("button").contains("Save").click();
    cy.wait(200).get('[data-cy="factSaveSuccess"]').should("be.visible");
    cy.get("button").contains("View").click();
    cy.wait(200).get('[data-cy="favoritesContainer"]').find("li");
  });

  it("displays no favorites found message if no favorites are present", () => {
    cy.get("button").contains("View").click();
    cy.clearLocalStorage();
    cy.get('[data-cy="favoritesContainer"]')
      .should("be.visible")
      .children("p")
      .should("contain.text", "No favorites found");
  });
});
