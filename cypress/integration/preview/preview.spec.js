describe("preview page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/preview/60f26ab342a997a1ff49c5c2/student");
  });

  it("shows video enabled", () => {
    cy.get("video").should("not.be.null");
  });

  it("should join", () => {
    cy.get("input").type("test");
    cy.get("button").should("have.text", "Join").click();
    cy.url().should("include", "meeting");
  });
});
