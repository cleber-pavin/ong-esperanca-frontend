export function iniciarModal(spa = false) {
    // O dialog nativo mantém o foco dentro e bloqueia o conteúdo atrás.
    const modalParticipacao = document.querySelector("#modal-participacao");
    const abrirModal = document.querySelector(".modal-toggle");
    if (modalParticipacao && abrirModal) {
        abrirModal.addEventListener("click", () => {
            modalParticipacao.showModal();
            document.body.classList.add("modal-aberto");
        });
        modalParticipacao.querySelector(".modal-close").addEventListener("click", () => {
            modalParticipacao.close();
            if (spa) document.body.classList.remove("modal-aberto");
        });
        // Este modal tem apenas um controle: Tab e Shift+Tab mantêm o foco nele.
        modalParticipacao.addEventListener("keydown", (evento) => {
            if (evento.key === "Tab") {
                evento.preventDefault();
                modalParticipacao.querySelector(".modal-close").focus();
            }
        });
        modalParticipacao.addEventListener("cancel", () => document.body.classList.remove("modal-aberto"));
        // Escape fecha pelo comportamento nativo; close atende às duas formas.
        modalParticipacao.addEventListener("close", () => {
            // Um fechamento antigo não deve desfazer a reabertura imediata.
            if (modalParticipacao.open) return;
            document.body.classList.remove("modal-aberto");
            if (abrirModal.isConnected) abrirModal.focus();
        });
    }
}
