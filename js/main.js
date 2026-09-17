import { iniciarMenu } from "./menu.js";
import { iniciarRouter } from "./router.js";
import { iniciarFormulario } from "./formulario.js";
import { iniciarModal } from "./modal.js";

// Ponto de entrada único. As páginas estáticas antigas usam o mesmo código.
const app = document.querySelector("#app");
iniciarMenu(Boolean(app));
if (app) iniciarRouter(app);
else {
    iniciarFormulario();
    iniciarModal();
}
