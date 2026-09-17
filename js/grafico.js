import { projetos } from "./projetos.js";

let graficoProjetos = null;

// O gráfico usa as mesmas categorias dos cards, sem números fixos no HTML.
export function inicializarGraficoProjetos(app) {
    const canvas = app.querySelector("#grafico-projetos");
    if (!canvas) return;
    const resumo = app.querySelector("#resumo-grafico-projetos");
    const mensagem = app.querySelector("#mensagem-grafico-projetos");
    const contagem = {};
    projetos.forEach((projeto) => {
        contagem[projeto.categoria] = (contagem[projeto.categoria] || 0) + 1;
    });
    const categorias = Object.keys(contagem);
    const quantidades = Object.values(contagem);
    resumo.textContent = categorias.map((categoria, indice) =>
        `${categoria}: ${quantidades[indice]} ${quantidades[indice] === 1 ? "projeto" : "projetos"}`
    ).join(". ") + ".";

    if (typeof Chart === "undefined") {
        mensagem.textContent = "O gráfico está indisponível. As quantidades aparecem no texto acima.";
        return;
    }

    try {
        const corPrimaria = getComputedStyle(document.documentElement).getPropertyValue("--cor-primaria").trim();
        graficoProjetos = new Chart(canvas, {
            type: "bar",
            data: {
                labels: categorias,
                datasets: [{ label: "Quantidade de projetos", data: quantidades, backgroundColor: corPrimaria }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    } catch {
        mensagem.textContent = "O gráfico está indisponível. As quantidades aparecem no texto acima.";
    }
}

export function destruirGraficoProjetos() {
    if (graficoProjetos) {
        graficoProjetos.destroy();
        graficoProjetos = null;
    }
}
