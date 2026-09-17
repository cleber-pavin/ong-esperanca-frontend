// Uma chave guarda somente os dados escolhidos para o cadastro local.
const chaveCadastro = "ongEsperancaCadastro";
const camposSalvos = ["nome", "email", "telefone", "cep", "endereco", "numero", "estado", "cidade", "participacao"];
const participacoes = ["voluntariado", "doacao", "ambos"];

export function salvarCadastro(dados) {
    localStorage.setItem(chaveCadastro, JSON.stringify(dados));
}

export function carregarCadastroSalvo() {
    try {
        const texto = localStorage.getItem(chaveCadastro);
        if (texto === null) return null;
        if (!texto) throw new Error();
        const dados = JSON.parse(texto);
        if (!dados || typeof dados !== "object" || Array.isArray(dados) ||
            camposSalvos.some((campo) => typeof dados[campo] !== "string" || !dados[campo].trim()) ||
            !participacoes.includes(dados.participacao)) throw new Error();
        return dados;
    } catch {
        descartarCadastroSalvo();
        return null;
    }
}

export function descartarCadastroSalvo() {
    try { localStorage.removeItem(chaveCadastro); } catch { /* armazenamento indisponível */ }
}
