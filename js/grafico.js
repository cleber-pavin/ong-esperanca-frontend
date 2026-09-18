import { projetos } from "./projetos.js";

let graficoProjetos = null;

function obterCoresGrafico() {
    const estilos = getComputedStyle(document.documentElement);
    return {
        barras: estilos.getPropertyValue("--cor-primaria").trim(),
        texto: estilos.getPropertyValue("--cor-texto").trim(),
        grade: estilos.getPropertyValue("--cor-grafico-grade").trim()
    };
}

function atualizarCoresGrafico() {
    if (!graficoProjetos) return;
    const cores = obterCoresGrafico();
    graficoProjetos.data.datasets[0].backgroundColor = cores.barras;
    for (const eixo of Object.values(graficoProjetos.options.scales)) {
        eixo.ticks.color = cores.texto;
        eixo.grid.color = cores.grade;
    }
    graficoProjetos.update("none");
}

window.addEventListener("contrastealterado", atualizarCoresGrafico);

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
        const cores = obterCoresGrafico();
        graficoProjetos = new Chart(canvas, {
            type: "bar",
            data: {
                labels: categorias,
                datasets: [{ label: "Quantidade de projetos", data: quantidades, backgroundColor: cores.barras }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: cores.texto }, grid: { color: cores.grade } },
                    y: { beginAtZero: true, ticks: { stepSize: 1, color: cores.texto }, grid: { color: cores.grade } }
                }
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
