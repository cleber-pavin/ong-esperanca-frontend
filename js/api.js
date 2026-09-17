// Busca e ordena os municípios de um Estado; o formulário cuida da interface.
export async function buscarCidades(uf) {
    const resposta = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    if (!resposta.ok) throw new Error();
    const municipios = await resposta.json();
    if (!Array.isArray(municipios) || municipios.length === 0) throw new Error();
    municipios.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    return municipios;
}
