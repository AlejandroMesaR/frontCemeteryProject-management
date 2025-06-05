describe('Prueba E2E - Generación de Reporte', () => {
  it('Debería generar y descargar el reporte exitosamente', () => {
    // 1. Iniciar sesión
    cy.visit('http://localhost:4000');
    cy.contains('Iniciar Sesión').click();
    cy.get('input[name="username"]').type('AlejandroMR');
    cy.get('input[name="password"]').type('Admin123');
    cy.contains('Entrar').click();

    // 2. Ir a la sección de Documentos (puede tardar en cargar)
    cy.contains('Documentos', { timeout: 10000 }).click();

    // 3. Hacer clic en Descargar Reporte
    cy.contains('Descargar Reporte', { timeout: 10000 }).click();

    // 4. Verificar que aparezca el popup de éxito
    cy.contains('El documento ha sido descargado exitosamente.', { timeout: 10000 }).should('be.visible');
  });
});
