describe('Prueba E2E - Inicio de Sesión', () => {
  it('Debería iniciar sesión con credenciales válidas', () => {
    cy.visit('http://localhost:4000'); // Cambia si tu frontend usa otro puerto

    cy.contains('Iniciar Sesión').click();
    cy.get('input[name="username"]').type('AlejandroMR');
    cy.get('input[name="password"]').type('Admin123');
    cy.contains('Entrar').click();

        // Esperar a que se oculte el popup de login
    cy.contains('Iniciar Sesión').should('not.exist');

    // Validar que se muestra una pestaña visible solo para usuarios logueados
    cy.contains('Registro de Cuerpos').should('be.visible');
  });

  it('Debe mostrar error con credenciales inválidas', () => {
    cy.visit('http://localhost:4000');
    cy.contains('Iniciar Sesión').click();
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('clave_invalida');
    cy.contains('Entrar').click();

    cy.contains('Error al iniciar sesión').should('exist'); // o el mensaje que uses
  });
});
