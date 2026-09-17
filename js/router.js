import { iniciarFormulario } from "./formulario.js";
import { iniciarModal } from "./modal.js";
import { renderizarProjetos } from "./projetos.js";
import { inicializarGraficoProjetos, destruirGraficoProjetos } from "./grafico.js";

function lerRota() {
    const caminho = location.hash.slice(1);
    if (!caminho || caminho === "/" || caminho === "#") return { pagina: "inicio", secao: "" };
    const rotas = {
        "/inicio": { pagina: "inicio", secao: "" },
        "/projetos": { pagina: "projetos", secao: "" },
        "/projetos/campanhas": { pagina: "projetos", secao: "campanhas" },
        "/projetos/voluntariado": { pagina: "projetos", secao: "titulo-voluntariado" },
        "/cadastro": { pagina: "cadastro", secao: "" }
    };
    return rotas[caminho] || { pagina: "inexistente", secao: "" };
}

function focarConteudo(app, secao) {
    const area = secao && app.querySelector(`#${secao}`);
    const destino = (area && (area.matches("h1, h2") ? area : area.querySelector("h2"))) || app.querySelector("h1");
    if (destino) {
        destino.setAttribute("tabindex", "-1");
        destino.focus();
    }
}

export function renderRoute(app, moverFoco = false) {
    const { pagina, secao } = lerRota();
    const template = document.querySelector(`#template-${pagina}`);
    const modalAberto = app.querySelector("#modal-participacao[open]");
    if (modalAberto) modalAberto.close();
    destruirGraficoProjetos();
    document.body.classList.remove("modal-aberto");
    app.replaceChildren(); // Limpa o conteúdo da rota anterior.
    if (template) app.appendChild(template.content.cloneNode(true)); // Injeta o novo fragmento.
    else app.innerHTML = '<section><h1>Página não encontrada</h1><p>A rota solicitada não existe. <a href="#/inicio">Voltar ao início</a>.</p></section>';

    app.className = pagina === "projetos" ? "container grid-12" :
        pagina === "cadastro" ? "container form-page" : "container";
    const titulos = { inicio: "Início", projetos: "Projetos", cadastro: "Cadastro" };
    document.title = `ONG Esperança - ${titulos[pagina] || "Página não encontrada"}`;
    document.querySelectorAll("#menu-principal .menu-list > li > a, #menu-principal .submenu-heading > a")
        .forEach((link) => {
            if (link.getAttribute("href") === `#/${pagina}`) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });

    if (pagina === "cadastro") iniciarFormulario(true);
    if (pagina === "projetos") {
        renderizarProjetos(app);
        inicializarGraficoProjetos(app);
        iniciarModal(true);
    }
    if (moverFoco) focarConteudo(app, secao);
    else if (secao) app.querySelector(`#${secao}`)?.scrollIntoView();
}

export function iniciarRouter(app) {
    // O link de pular foca o main sem trocar o hash da rota.
    document.querySelector(".skip-link").addEventListener("click", (evento) => {
        evento.preventDefault();
        app.focus();
    });
    // Links de hash já mudam location.hash; hashchange chama o renderizador.
    document.addEventListener("click", (evento) => {
        const link = evento.target.closest('a[href^="#/"]');
        if (link && link.hash === location.hash) focarConteudo(app, lerRota().secao);
    });
    window.addEventListener("hashchange", () => renderRoute(app, true));
    renderRoute(app); // O módulo executa após o HTML estar pronto.
}
