// Menu e submenu permanecem na página enquanto a SPA troca o conteúdo principal.
export function iniciarMenu(spa = false) {
    // Menu global: os listeners são instalados uma única vez.
    const menu = document.querySelector("#menu-principal");
    const botaoMenu = document.querySelector(".menu-toggle");
    const itemProjetos = document.querySelector(".has-submenu");
    const botaoSubmenu = document.querySelector(".submenu-toggle");
    const telaMobile = window.matchMedia("(max-width: 768px)");
    let ultimoFoco = document.activeElement;
    document.addEventListener("focusin", (evento) => { ultimoFoco = evento.target; });

    function fecharSubmenu() {
        itemProjetos.classList.remove("submenu-aberto");
        botaoSubmenu.setAttribute("aria-expanded", "false");
    }

    function fecharMenu() {
        menu.classList.remove("menu-aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.querySelector(".menu-label").textContent = "Abrir menu";
        botaoMenu.querySelector(".menu-icon").textContent = "☰";
        fecharSubmenu();
    }

    function ajustarMenu() {
        // A mudança de largura pode ocultar o botão antes do evento e levar o foco ao body.
        const foco = document.activeElement === document.body ? ultimoFoco : document.activeElement;
        fecharMenu();
        itemProjetos.classList.remove("submenu-fechado");
        menu.classList.add("menu-condensado");
        botaoMenu.hidden = !telaMobile.matches;
        botaoSubmenu.hidden = !telaMobile.matches;
        if (telaMobile.matches && menu.contains(foco)) botaoMenu.focus();
        else if (!telaMobile.matches && (foco === botaoMenu || foco === botaoSubmenu)) {
            menu.querySelector("a").focus();
        }
    }

    botaoMenu.addEventListener("click", () => {
        if (menu.classList.contains("menu-aberto")) fecharMenu();
        else {
            menu.classList.add("menu-aberto");
            botaoMenu.setAttribute("aria-expanded", "true");
            botaoMenu.querySelector(".menu-label").textContent = "Fechar menu";
            botaoMenu.querySelector(".menu-icon").textContent = "×";
        }
    });

    botaoSubmenu.addEventListener("click", () => {
        const posicao = window.scrollY;
        const aberto = itemProjetos.classList.toggle("submenu-aberto");
        botaoSubmenu.setAttribute("aria-expanded", String(aberto));
        // Mantém a posição da tela quando os novos links aumentam a altura do cabeçalho.
        requestAnimationFrame(() => window.scrollTo(0, posicao));
    });

    menu.addEventListener("click", (evento) => {
        const link = evento.target.closest("a");
        if (!link) return;
        if (telaMobile.matches) fecharMenu();
        if (spa) return; // O roteador cuidará do foco.
        const destino = new URL(link.href);
        if (destino.pathname === location.pathname && destino.hash) {
            const secao = document.getElementById(decodeURIComponent(destino.hash.slice(1)));
            if (secao) { secao.setAttribute("tabindex", "-1"); secao.focus(); }
        } else if (telaMobile.matches) botaoMenu.focus();
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key !== "Escape") return;
        if (telaMobile.matches && itemProjetos.classList.contains("submenu-aberto")) {
            fecharSubmenu();
            botaoSubmenu.focus();
        } else if (telaMobile.matches && menu.classList.contains("menu-aberto")) {
            fecharMenu();
            botaoMenu.focus();
        } else if (!telaMobile.matches && itemProjetos.matches(":hover, :focus-within")) {
            itemProjetos.classList.add("submenu-fechado");
            itemProjetos.querySelector("a").focus();
        }
    });

    itemProjetos.addEventListener("mouseenter", () => itemProjetos.classList.remove("submenu-fechado"));
    itemProjetos.addEventListener("focusin", (evento) => {
        if (!itemProjetos.contains(evento.relatedTarget)) itemProjetos.classList.remove("submenu-fechado");
    });
    telaMobile.addEventListener("change", ajustarMenu);
    ajustarMenu();
}
