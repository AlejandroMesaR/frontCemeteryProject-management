describe("Crear un nuevo cuerpo desde el botón en la UI", () => {
  it("debería iniciar sesión, ir a la vista de cuerpos, abrir el formulario y registrar un cuerpo", () => {
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
    cy.contains("Registro de Cuerpos").should("be.visible");

    // Navegar manualmente a /bodies
    cy.visit("http://localhost:4000/bodies");

    // Asegurarse de que estamos en la vista correcta
    cy.contains("Admisiones del cuerpo").should("be.visible");

    // Hacer clic en el botón de crear nuevo cuerpo
    cy.get("button.bg-green-600").click();

    // Llenar el formulario
    cy.get("input[name=nombre]").type("Mateo");
    cy.get("input[name=apellido]").type("Prueba");
    cy.get("input[name=documentoIdentidad]").type("1558924");
    cy.get("input[name=numeroProtocoloNecropsia]").type("NP-025");
    cy.get("input[name=causaMuerte]").type("Causa desconocida");

    cy.get("input[name=fechaNacimiento]").type("2000-09-26");
    cy.get("input[name=fechaDefuncion]").type("2080-11-15");
    cy.get("input[name=fechaIngreso]").type("2080-11-16T09:45:00");
    cy.get("input[name=fechaInhumacion]").type("2080-11-17");
    cy.get("input[name=fechaExhumacion]").type("2090-11-17");

    cy.get("input[name=funcionarioReceptor]").type("Luis Martínez");
    cy.get("input[name=cargoFuncionario]").type("Médico Forense");
    cy.get("input[name=autoridadRemitente]").type("Policía Nacional");
    cy.get("input[name=cargoAutoridadRemitente]").type("Inspector");
    cy.get("input[name=autoridadExhumacion]").type("Fiscalía");
    cy.get("input[name=cargoAutoridadExhumacion]").type("Fiscal");

    cy.get("input[name=estado]").type("INHUMADO");
    cy.get("input[name=observaciones]").type("Sin observaciones importantes.");

    // Enviar el formulario
    cy.get("button.bg-green-800").click();

    //Verificar el éxito
    cy.contains("Cuerpo Mateo Prueba creado correctamente", {
      timeout: 10000,
    }).should("be.visible");
  });

  it("debería iniciar sesión, ir a la vista de cuerpos, abrir el formulario y sacar error", () => {
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
    cy.contains("Registro de Cuerpos").should("be.visible");

    // Navegar manualmente a /bodies
    cy.visit("http://localhost:4000/bodies");

    // Asegurarse de que estamos en la vista correcta
    cy.contains("Admisiones del cuerpo").should("be.visible");

    // Hacer clic en el botón de crear nuevo cuerpo
    cy.get("button.bg-green-600").click();

    // Llenar el formulario
    cy.get("input[name=nombre]").type("Mateo");
    cy.get("input[name=apellido]").type("Prueba");
    cy.get("input[name=documentoIdentidad]").type("1558924");
    cy.get("input[name=numeroProtocoloNecropsia]").type("NP-025");
    cy.get("input[name=causaMuerte]").type("Causa desconocida");

    cy.get("input[name=fechaNacimiento]").type("2000-09-26");
    cy.get("input[name=fechaDefuncion]").type("2080-11-15");
    cy.get("input[name=fechaIngreso]").type("2080-11-16T09:45:00");
    cy.get("input[name=fechaInhumacion]").type("2080-11-17");
    cy.get("input[name=fechaExhumacion]").type("2090-11-17");

    cy.get("input[name=funcionarioReceptor]").type("Luis Martínez");
    cy.get("input[name=cargoFuncionario]").type("Médico Forense");
    cy.get("input[name=autoridadRemitente]").type("Policía Nacional");
    cy.get("input[name=cargoAutoridadRemitente]").type("Inspector");
    cy.get("input[name=autoridadExhumacion]").type("Fiscalía");
    cy.get("input[name=cargoAutoridadExhumacion]").type("Fiscal");

    cy.get("input[name=estado]").type("NOSE");
    cy.get("input[name=observaciones]").type("Sin observaciones importantes.");

    // Enviar el formulario
    cy.get("button.bg-green-800").click();

    //Verificar el éxito
    cy.contains("Request failed with status code 400", {
      timeout: 10000,
    }).should("exist");
  });
});
