// Dados e cards dos projetos da ONG.
export const projetos = [
    {
        titulo: "Campanha de alimentos",
        categoria: "Doação",
        descricao: "Arrecadação de alimentos não perecíveis para apoiar pessoas atendidas pela ONG.",
        status: "Ativo",
        destino: "#/projetos/campanhas",
        acao: "Ver campanhas de doação"
    },
    {
        titulo: "Campanha de roupas",
        categoria: "Doação",
        descricao: "Recebimento de roupas limpas e em bom estado para as ações sociais da ONG.",
        status: "Ativo",
        destino: "#/projetos/campanhas",
        acao: "Ver campanhas de doação"
    },
    {
        titulo: "Ações comunitárias",
        categoria: "Voluntariado",
        descricao: "Voluntários ajudam na organização de doações e nas atividades da comunidade.",
        status: "Em andamento",
        destino: "#/projetos/voluntariado",
        acao: "Conhecer o voluntariado"
    }
];

// Componentes de projetos: cada objeto preenche uma cópia do mesmo template.
export function renderizarProjetos(app) {
    const lista = app.querySelector("#lista-projetos");
    const template = document.querySelector("#template-card-projeto");
    if (!lista || !template) return;
    lista.replaceChildren();

    projetos.forEach((projeto) => {
        const card = template.content.cloneNode(true);
        card.querySelector(".projeto-titulo").textContent = projeto.titulo;
        card.querySelector(".projeto-categoria").textContent = projeto.categoria;
        card.querySelector(".projeto-descricao").textContent = projeto.descricao;
        const badgeStatus = card.querySelector(".projeto-status");
        badgeStatus.textContent = projeto.status;
        badgeStatus.classList.add(projeto.status === "Ativo" ? "badge-success" : "badge-warning");
        const link = card.querySelector(".projeto-link");
        link.textContent = projeto.acao;
        link.setAttribute("href", projeto.destino);
        lista.appendChild(card);
    });
}

