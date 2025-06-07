describe("Asignar nicho desde el botón en la UI", () => {
  it("debería iniciar sesión, ir a la sesion nichos, abrir el formulario y asignar nichos", () => {
    // Ir a la página de login
    cy.visit("http://localhost:4000");

    // Iniciar sesión
    cy.contains("Iniciar Sesión").click();
    cy.get('input[name="username"]').type("AlejandroMR");
    cy.get('input[name="password"]').type("Admin123");
    cy.contains("Entrar").click();

    // Esperar a que se oculte el popup de login
    cy.contains("Iniciar Sesión").should("not.exist");

    // Validar que se muestra una pestaña visible solo para usuarios logueados
    cy.contains("Distribucion del Cementerio").should("be.visible");

    // Navegar manualmente a /map
    cy.visit("http://localhost:4000/map");

    // Hacer clic en el botón de asignar nicho
    cy.contains("button", "Asignar Nicho").click();

    // Para el select de Nicho
    cy.get("select")
      .eq(0)
      .find("option")
      .eq(1)
      .then(($option) => {
        cy.get("select").eq(0).select($option.val());
      });

    // Para el select de Cuerpo Inhumado
    cy.get("select")
      .eq(1)
      .find("option")
      .eq(1)
      .then(($option) => {
        cy.get("select").eq(1).select($option.val());
      });

    // Hacer clic en el botón de asignar nicho
    cy.get("button.bg-green-600", { timeout: 10000 }).click();

    //Verificar el éxito
    cy.contains("Se ha asignado el nicho correctamente.", {
      timeout: 10000,
    }).should("be.visible");

  });
});
