describe('Test Kalkulatora', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080');
    });

    it('Odejmowanie 9 - 4 = 5', () => {
        cy.get('[data-key="9"]').click();
        cy.get('[data-key="-"]').click();
        cy.get('[data-key="4"]').click();
        cy.get('[data-key="="]').click();

        cy.get('.display .output').should('have.text', '5');
    });

    it('Dzielenie 8 ÷ 2 = 4', () => {
        cy.get('[data-key="8"]').click();
        cy.get('[data-key="/"]').click();
        cy.get('[data-key="2"]').click();
        cy.get('[data-key="="]').click();

        cy.get('.display .output').should('have.text', '4');
    });

    it('Działanie na liczbach dziesiętnych 2.5 + 3.5 = 6', () => {
        cy.get('[data-key="2"]').click();
        cy.get('[data-key="."]').click();
        cy.get('[data-key="5"]').click();
        cy.get('[data-key="+"]').click();
        cy.get('[data-key="3"]').click();
        cy.get('[data-key="."]').click();
        cy.get('[data-key="5"]').click();
        cy.get('[data-key="="]').click();

        cy.get('.display .output').should('have.text', '6');
    });

    it('Dzielenie przez zero 5 ÷ 0', () => {
        cy.get('[data-key="5"]').click();
        cy.get('[data-key="/"]').click();
        cy.get('[data-key="0"]').click();
        cy.get('[data-key="="]').click();

        cy.get('.display .output').should('not.have.text', 'Infinity'); // Sprawdza, czy kalkulator obsługuje błąd
    });
});
