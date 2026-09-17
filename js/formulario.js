import { salvarCadastro, carregarCadastroSalvo, descartarCadastroSalvo } from "./storage.js";
import { buscarCidades } from "./api.js";

export function iniciarFormulario(persistir = false) {
    const cpf = document.querySelector("#cpf");
    const telefone = document.querySelector("#telefone");
    const cep = document.querySelector("#cep");
    const estado = document.querySelector("#estado");
    const cidade = document.querySelector("#cidade");
    const statusCidade = document.querySelector("#status-cidade");
    const formulario = document.querySelector("#form-cadastro");
    const mensagemFormulario = document.querySelector("#mensagem-formulario");
    let solicitacaoCidades = 0;
    if (!formulario) return;

    if (persistir) {
        // Limites amplos evitam datas futuras ou anteriores à vida de uma pessoa.
        const hoje = new Date();
        const dataLocal = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000);
        const dataMinima = new Date(dataLocal);
        dataMinima.setUTCFullYear(dataMinima.getUTCFullYear() - 150);
        const nascimento = formulario.querySelector("#nascimento");
        nascimento.min = dataMinima.toISOString().slice(0, 10);
        nascimento.max = dataLocal.toISOString().slice(0, 10);
    }

    function verificarTexto(campo) {
        if (!persistir || !["nome", "endereco", "numero"].includes(campo.id)) return;
        const tamanho = campo.value.trim().length;
        const mensagens = {
            nome: "Digite seu nome completo, com pelo menos 3 caracteres sem contar espaços e ao menos uma letra.",
            endereco: "Digite seu endereço, com pelo menos 3 caracteres sem contar espaços.",
            numero: "Digite um número do endereço ou s/n; espaços ou símbolos isolados não bastam."
        };
        const semLetra = campo.id === "nome" && !/\p{L}/u.test(campo.value);
        const semNumero = campo.id === "numero" && !/\d/.test(campo.value) && !/^s\/n$/i.test(campo.value.trim());
        campo.setCustomValidity(campo.value && (tamanho < (campo.id === "numero" ? 1 : 3) || semLetra || semNumero) ?
            mensagens[campo.id] : "");
    }

    function limparSucesso(campo) {
        const radio = campo.type === "radio";
        const contentor = radio ? formulario.querySelector(".radio-group") : campo;
        contentor.classList.remove("field-valid", "field-invalid");
        const indicador = document.getElementById(radio ? "participacao-sucesso" : `${campo.id}-sucesso`);
        if (indicador) indicador.hidden = true;
    }

    function prepararIndicador(campo) {
        const radio = campo.type === "radio";
        const contentor = radio ? formulario.querySelector(".radio-group") : campo;
        const id = radio ? "participacao-sucesso" : `${campo.id}-sucesso`;
        let indicador = document.getElementById(id);
        if (!indicador) {
            indicador = document.createElement("small");
            indicador.id = id;
            indicador.className = "success-message field-feedback";
            indicador.hidden = true;
            const local = radio ? contentor.parentElement : campo.closest(".field");
            local.appendChild(indicador);
            const campos = radio ? formulario.querySelectorAll('[name="participacao"]') : [campo];
            campos.forEach((item) => {
                item.setAttribute("aria-describedby", `${item.getAttribute("aria-describedby")} ${id}`);
            });
        }
        return indicador;
    }

    function atualizarValidacao(campo) {
        if (!campo.matches("input, select") || campo.disabled || !campo.value.trim()) return;
        if (campo === estado && cidade.disabled && !statusCidade.classList.contains("error-message")) return;
        if (campo.type === "radio" && !campo.checked) return;
        if (!campo.validity.valid) return;
        const radio = campo.type === "radio";
        const contentor = radio ? formulario.querySelector(".radio-group") : campo;
        contentor.classList.add("field-valid");
        const indicador = prepararIndicador(campo);
        indicador.textContent = radio ? "Opção selecionada." : "Preenchimento válido.";
        indicador.hidden = false;
    }

    function limparErro(campo) {
        limparSucesso(campo);
        const idErro = campo.type === "radio" ? "participacao-erro" : `${campo.id}-erro`;
        const erro = document.getElementById(idErro);
        erro.textContent = "";
        erro.hidden = true;
        const campos = campo.type === "radio" ? formulario.querySelectorAll('[name="participacao"]') : [campo];
        campos.forEach((item) => {
            item.removeAttribute("aria-invalid");
            if (item !== estado) item.setCustomValidity("");
        });
    }

    if (formulario) {
        const botaoEnvio = formulario.querySelector('button[type="submit"]');
        formulario.querySelectorAll("input, select").forEach(prepararIndicador);
        formulario.addEventListener("invalid", (evento) => {
            const campo = evento.target;
            limparSucesso(campo);
            if (campo.type === "radio") formulario.querySelector(".radio-group").classList.add("field-invalid");
            const obrigatorios = {
                nome: "Digite seu nome completo.",
                nascimento: "Informe sua data de nascimento.",
                cpf: "Digite seu CPF no formato 000.000.000-00.",
                email: "Digite seu e-mail, como nome@exemplo.com.",
                telefone: "Digite seu telefone com DDD, como (11) 3333-4444 ou (11) 99999-9999.",
                cep: "Digite seu CEP no formato 00000-000.",
                endereco: "Digite seu endereço.",
                numero: "Digite o número do endereço ou s/n.",
                estado: "Selecione um estado.",
                cidade: "Selecione uma cidade."
            };
            let texto = campo.type === "radio" ? "Escolha uma forma de participação." : obrigatorios[campo.id];
            if (campo.validity.customError) texto = campo.validationMessage;
            else if (campo.validity.badInput) texto = "Informe uma data completa e válida.";
            else if (campo.validity.rangeOverflow && campo.id === "nascimento") texto = "Informe uma data de nascimento que não esteja no futuro.";
            else if (campo.validity.rangeUnderflow && campo.id === "nascimento") texto = "Informe uma data de nascimento dentro de um período plausível.";
            else if (campo.validity.tooShort) texto = "Digite pelo menos 3 caracteres neste campo.";
            else if (campo.validity.typeMismatch) texto = "Digite um e-mail válido, como nome@exemplo.com.";
            if (!texto.startsWith("Erro: ")) texto = `Erro: ${texto}`;
            const idErro = campo.type === "radio" ? "participacao-erro" : `${campo.id}-erro`;
            const erro = document.getElementById(idErro);
            erro.textContent = texto;
            erro.hidden = false;
            campo.setAttribute("aria-invalid", "true");
            campo.setCustomValidity(texto);
            mensagemFormulario.textContent = "Erro: revise os campos indicados. As mensagens abaixo de cada campo explicam o que corrigir.";
            mensagemFormulario.className = "form-message error-message alert alert-error";
        }, true);

        formulario.addEventListener("input", (evento) => {
            limparErro(evento.target);
            verificarTexto(evento.target);
            mensagemFormulario.textContent = "";
            mensagemFormulario.className = "form-message alert";
        });

        formulario.addEventListener("focusout", (evento) => {
            atualizarValidacao(evento.target);
        });
        formulario.addEventListener("change", (evento) => {
            if (evento.target.matches("input, select") && evento.target !== estado) atualizarValidacao(evento.target);
        });

        function atualizarMascara(campo, valorFormatado) {
            const cursor = campo.selectionStart;
            const estavaNoFim = cursor === campo.value.length;
            const digitosAntes = campo.value.slice(0, cursor).replace(/\D/g, "").length;
            campo.value = valorFormatado;
            if (!estavaNoFim) {
                let posicao = 0;
                let digitos = 0;
                while (posicao < campo.value.length && digitos < digitosAntes) {
                    if (/\d/.test(campo.value[posicao])) digitos++;
                    posicao++;
                }
                campo.setSelectionRange(posicao, posicao);
            }
        }

        cpf.addEventListener("input", () => {
            const numeros = cpf.value.replace(/\D/g, "").slice(0, 11);
            atualizarMascara(cpf, numeros
                .replace(/^(\d{3})(\d)/, "$1.$2")
                .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/\.(\d{3})(\d)/, ".$1-$2"));
        });

        telefone.addEventListener("input", () => {
            const numeros = telefone.value.replace(/\D/g, "").slice(0, 11);
            atualizarMascara(telefone, numeros
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(numeros.length > 10 ? /(\d{5})(\d)/ : /(\d{4})(\d)/, "$1-$2"));
        });

        cep.addEventListener("input", () => {
            const numeros = cep.value.replace(/\D/g, "").slice(0, 8);
            atualizarMascara(cep, numeros.replace(/^(\d{5})(\d)/, "$1-$2"));
        });

        async function carregarCidades(mostrarValidacao = true) {
            const solicitacaoAtual = ++solicitacaoCidades;
            const ufSelecionada = estado.value;
            botaoEnvio.disabled = false;
            botaoEnvio.textContent = "Enviar cadastro";
            estado.setCustomValidity("");
            limparErro(estado);
            limparErro(cidade);
            mensagemFormulario.textContent = "";
            mensagemFormulario.className = "form-message alert";
            cidade.disabled = true;
            cidade.innerHTML = '<option value="">Carregando cidades...</option>';
            statusCidade.textContent = "Carregando cidades. Aguarde para selecionar uma cidade.";
            statusCidade.className = "status alert alert-info";

            if (!estado.value) {
                cidade.innerHTML = '<option value="">Selecione o estado</option>';
                statusCidade.textContent = "Selecione um estado para carregar as cidades.";
                return;
            }

            estado.setCustomValidity("Aguarde o carregamento das cidades antes de enviar o cadastro.");
            botaoEnvio.disabled = true;
            botaoEnvio.textContent = "Aguarde as cidades...";

            try {
                const municipios = await buscarCidades(ufSelecionada);
                if (solicitacaoAtual !== solicitacaoCidades) return;

                cidade.innerHTML = '<option value="">Selecione a cidade</option>';
                municipios.forEach((municipio) => {
                    const opcao = document.createElement("option");
                    opcao.value = municipio.nome;
                    opcao.textContent = municipio.nome;
                    cidade.appendChild(opcao);
                });

                cidade.disabled = false;
                estado.setCustomValidity("");
                limparErro(estado);
                statusCidade.textContent = `Sucesso: ${municipios.length} cidades carregadas. Selecione uma cidade.`;
                statusCidade.className = "status alert alert-success";
                if (mostrarValidacao) atualizarValidacao(estado);
            } catch {
                if (solicitacaoAtual !== solicitacaoCidades) return;
                estado.setCustomValidity("As cidades estão indisponíveis. Selecione o estado novamente para tentar carregar.");
                cidade.innerHTML = '<option value="">Cidades indisponíveis</option>';
                statusCidade.textContent = "Não foi possível carregar as cidades. Verifique sua conexão e tente selecionar o estado novamente.";
                statusCidade.className = "status error-message alert alert-error";
            } finally {
                if (solicitacaoAtual === solicitacaoCidades) {
                    botaoEnvio.disabled = false;
                    botaoEnvio.textContent = "Enviar cadastro";
                }
            }
        }
        estado.addEventListener("change", () => carregarCidades());

        function coletarDados() {
            const dados = {
                nome: formulario.querySelector("#nome").value,
                email: formulario.querySelector("#email").value,
                telefone: telefone.value,
                cep: cep.value,
                endereco: formulario.querySelector("#endereco").value,
                numero: formulario.querySelector("#numero").value,
                estado: estado.value,
                cidade: cidade.value,
                participacao: formulario.querySelector('[name="participacao"]:checked').value
            };
            return dados;
        }

        async function restaurarCadastro() {
            const dados = carregarCadastroSalvo();
            if (!dados) return;

            if (!Array.from(estado.options).some((opcao) => opcao.value === dados.estado)) {
                descartarCadastroSalvo();
                return;
            }

            for (const id of ["nome", "email", "telefone", "cep", "endereco", "numero"]) {
                formulario.querySelector(`#${id}`).value = dados[id];
            }
            ["nome", "endereco", "numero"].forEach((id) => verificarTexto(formulario.querySelector(`#${id}`)));
            if (["nome", "email", "telefone", "cep", "endereco", "numero"]
                .some((id) => !formulario.querySelector(`#${id}`).validity.valid)) {
                descartarCadastroSalvo();
                formulario.reset();
                ["nome", "endereco", "numero"].forEach((id) => verificarTexto(formulario.querySelector(`#${id}`)));
                return;
            }
            const opcaoParticipacao = Array.from(formulario.querySelectorAll('[name="participacao"]'))
                .find((opcao) => opcao.value === dados.participacao);
            if (opcaoParticipacao) opcaoParticipacao.checked = true;

            estado.value = dados.estado;
            await carregarCidades(false);
            if (estado.value === dados.estado && !cidade.disabled && typeof dados.cidade === "string" &&
                Array.from(cidade.options).some((opcao) => opcao.value === dados.cidade)) cidade.value = dados.cidade;
        }

        formulario.addEventListener("submit", (evento) => {
            evento.preventDefault();
            formulario.querySelectorAll("input, select").forEach(atualizarValidacao);
            if (persistir) {
                try {
                    salvarCadastro(coletarDados());
                    mensagemFormulario.textContent = "Sucesso: Cadastro validado e dados salvos neste navegador. Como este é um projeto acadêmico sem servidor, os dados não foram enviados.";
                    mensagemFormulario.className = "form-message success-message alert alert-success";
                } catch {
                    mensagemFormulario.textContent = "Cadastro validado, mas não foi possível salvar os dados neste navegador. Os dados não foram enviados.";
                    mensagemFormulario.className = "form-message error-message alert alert-error";
                }
            } else {
                mensagemFormulario.textContent = "Sucesso: Cadastro validado. Como este é um projeto acadêmico sem servidor, os dados não foram enviados.";
                mensagemFormulario.className = "form-message success-message alert alert-success";
            }
        });

        if (persistir) restaurarCadastro();

    }

}
