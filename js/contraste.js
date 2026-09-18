const CHAVE_CONTRASTE = "ongEsperancaAltoContraste";

function carregarPreferencia() {
    try {
        return localStorage.getItem(CHAVE_CONTRASTE) === "true";
    } catch {
        return false;
    }
}

function salvarPreferencia(ativa) {
    try {
        localStorage.setItem(CHAVE_CONTRASTE, String(ativa));
    } catch {
        // A alternância continua válida durante a sessão sem armazenamento.
    }
}

export function iniciarContraste() {
    const botao = document.querySelector(".contrast-toggle");
    if (!botao) return;
    let contrasteAtivo = carregarPreferencia();

    function aplicarContraste() {
        document.documentElement.classList.toggle("alto-contraste", contrasteAtivo);
        botao.setAttribute("aria-pressed", String(contrasteAtivo));
        botao.textContent = contrasteAtivo ? "Desativar alto contraste" : "Ativar alto contraste";
        window.dispatchEvent(new CustomEvent("contrastealterado"));
    }

    botao.addEventListener("click", () => {
        contrasteAtivo = !contrasteAtivo;
        aplicarContraste();
        salvarPreferencia(contrasteAtivo);
    });

    aplicarContraste();
}
