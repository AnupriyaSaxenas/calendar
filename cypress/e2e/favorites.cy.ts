describe("Favorites", () => {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 1);

  beforeEach(() => {
    cy.visit("/calendar");
    cy.get(".react-datepicker__input-container input").click();
    cy.get(".react-datepicker__day").contains(newDate.getDate()).click();
    cy.get('[data-cy="factText"]').then((factElement) => {
      const expectedFact = `${factElement.text()}`;
      cy.get('[data-cy="factText"]').should("have.text", expectedFact);
    });
    cy.wait(200).get("button").contains("Save").click();
    cy.wait(200).get('[data-cy="factSaveSuccess"]').should("be.visible");
    cy.get("button").contains("View").click();
  });

  it("displays the clickable clear favorites button which clears the favorites list", () => {
    cy.wait(200).get("button").contains("Clear").click();
    cy.wait(200)
      .get('[data-cy="favoritesContainer"]')
      .should("be.visible")
      .children("p")
      .should("contain.text", "No favorites found");
  });

  it("displays the clickable close button which closes the favorites list", () => {
    cy.wait(200).get("button").contains("Close").click();
    cy.wait(200).get("button").contains("Save");
  });
});
