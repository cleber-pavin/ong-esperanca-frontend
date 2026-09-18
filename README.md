# ONG Esperança

## Visão geral

Este é um projeto acadêmico da disciplina Desenvolvimento Front-end, desenvolvido de forma incremental nas Experiências Práticas I a IV. A aplicação apresenta a ONG fictícia Esperança, suas ações sociais, campanhas de doação, oportunidades de voluntariado e um formulário para novos apoiadores.

## Funcionalidades principais

- navegação SPA por rotas hash, com páginas estáticas mantidas para compatibilidade;
- cards de projetos gerados por template e gráfico de categorias;
- formulário com máscaras, validação, consulta de cidades e persistência local;
- menu responsivo e modal nativo para orientações de participação;
- recursos de acessibilidade, como HTML semântico, foco visível e regiões `aria-live`.

## Estrutura de pastas

```text
projeto-ong/
├── html/
│   ├── index.html
│   ├── projetos.html
│   └── cadastro.html
├── imagens/
│   ├── ong.jpg
│   └── ong.webp
├── css/
│   └── style.css
├── js/
│   ├── main.js (entrada da SPA)
│   ├── router.js, menu.js, modal.js e formulario.js
│   ├── storage.js, api.js, projetos.js e grafico.js
│   └── script.js (compatibilidade com as páginas antigas)
└── README.md
```

## Páginas

- `index.html`: apresenta a ONG, sua missão, formas de participação e contato.
- `projetos.html`: explica separadamente as campanhas de doação e o trabalho voluntário.
- `cadastro.html`: contém o formulário de cadastro de apoiadores e voluntários.

## Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| HTML5 | Estrutura semântica, formulário, elementos `template`, `dialog` e `picture`. |
| CSS3 | Design System, Grid, Flexbox, responsividade e estados de foco e validação. |
| JavaScript ES6 | SPA, módulos nativos, templates dinâmicos, menu, modal e validações. |
| Web Storage API | Persistência local dos dados permitidos do cadastro com `localStorage`. |
| Fetch API e API do IBGE | Consulta assíncrona das cidades conforme o Estado selecionado. |
| Chart.js 4.5.1 | Gráfico de barras carregado por CDN na rota de projetos. |
| Git e GitHub | Versionamento, GitFlow, Issues, Milestones e Pull Requests. |

O projeto não usa framework, banco de dados ou backend.

## Como abrir localmente

Não há instalação de dependências nem etapa de build. Para abrir a SPA, use um servidor local, pois os módulos JavaScript são carregados por HTTP. Abra a pasta `projeto-ong` no terminal e, caso o Python esteja instalado, execute:

```text
python -m http.server 8000
```

Depois, acesse `http://localhost:8000/html/index.html`.

É necessário estar conectado à internet para carregar a lista de cidades fornecida pela API pública do IBGE.

## Formulário e validações

O formulário usa validações nativas do HTML5, como `required`, `minlength`, `maxlength`, `pattern`, `type="email"`, `type="date"` e `type="tel"`. CPF, telefone e CEP têm validação de formato. O projeto não verifica se esses dados existem de verdade.

O JavaScript aplica as máscaras enquanto a pessoa digita:

- CPF: `000.000.000-00`
- telefone: `(00) 00000-0000`
- CEP: `00000-000`

O campo Cidade permanece desabilitado até a seleção do Estado. Depois disso, o JavaScript consulta a API do IBGE, ordena as cidades alfabeticamente e trata possíveis erros de conexão.

Como o trabalho não possui backend, depois que o navegador valida os campos é exibido um aviso informando que os dados não foram enviados.

## Assets utilizados

A página inicial usa a mesma imagem institucional em dois formatos otimizados para a web: `imagens/ong.webp`, oferecido como formato preferencial, e `imagens/ong.jpg`, usado como alternativa pelo navegador. Os dois arquivos têm 1200 por 675 pixels. O HTML utiliza o elemento `picture`, com `source` para WebP e `img` para o JPG.

## Acessibilidade

As páginas usam elementos semânticos, hierarquia de títulos, texto alternativo na imagem, labels associados aos campos, grupos com `fieldset` e `legend`, link para pular ao conteúdo principal e foco visível para navegação por teclado.

Na auditoria semântica da Experiência IV, os landmarks nativos foram preservados, `aria-current` passou a identificar também a subrota ativa e o modal manteve o elemento `<dialog>` com controle de foco, `Tab` e `Escape`. Foram executadas verificações de teclado no Edge e uma análise automatizada das rotas principais; esses resultados não representam conformidade integral com a WCAG 2.1 AA nem substituem testes com tecnologias assistivas.

## Validação W3C

Para verificar os arquivos, acesse o [W3C Markup Validation Service](https://validator.w3.org/), escolha a opção de envio de arquivo e valide separadamente `index.html`, `projetos.html` e `cadastro.html`. Como os arquivos usam caminhos relativos, a ausência dos arquivos de CSS ou imagem no validador não representa erro de sintaxe HTML.

## Experiência Prática II - Estilização e Layouts

Nesta etapa, trabalhei o Design System e a estrutura responsiva. Mantive o conteúdo e as funcionalidades da Experiência I e fiz as alterações em uma cópia separada.

### Design System

As variáveis ficam no início de `css/style.css`, dentro de `:root`. Usei verde principal (`#2f6f4e`) em links e botões, verde escuro (`#24563d`) em títulos, cabeçalho e rodapé, verde claro (`#dcefe4`) em áreas secundárias e amarelo (`#f2b84b`) em pequenos destaques. As cores neutras são fundo (`#f7f8f6`), superfície (`#ffffff`), texto (`#222222`) e texto secundário (`#5f6360`). Acrescentei vermelho escuro (`#972525`) para o aviso de erro já existente.

A fonte é Arial, Helvetica, sans-serif. Os cinco tamanhos são 0.875rem para textos auxiliares, 1rem para texto normal, 1.25rem para subtítulos, 1.75rem para títulos de seção e 2.25rem para o título principal. Os espaçamentos seguem a escala de 4, 8, 16, 24, 32 e 48px, aplicada em margens, preenchimentos e gaps.

### Grid e Flexbox

A classe `.grid-12` usa `repeat(12, minmax(0, 1fr))`. Assim, existem doze colunas e o conteúdo pode diminuir sem forçar a largura da página. As classes `.col-4`, `.col-6`, `.col-8` e `.col-12` indicam quantas colunas um bloco ocupa.

Usei Grid na apresentação inicial, nos cards de participação, na página de projetos e nos grupos de campos do formulário. Flexbox organiza o cabeçalho, a lista de links, o conteúdo dos cards, os labels e campos e as opções de participação.

### Responsividade

- Até 992px: diminui o padding das seções e divide a apresentação em duas metades.
- Até 768px: coloca o cabeçalho em coluna e empilha a apresentação e as seções de projetos.
- Até 576px: empilha os cards e os campos, reduz os paddings e coloca as opções de participação em coluna.

O menu continua visível e pode quebrar linha. Não foi necessário criar um menu com JavaScript nesta etapa. As imagens mantêm a proporção e se adaptam à largura disponível.

### Acessibilidade visual e verificação

Mantive o link para pular ao conteúdo, os labels, os textos alternativos, as regiões `aria-live` e a identificação da página atual. Usei `:focus-visible`, links sublinhados e cores com contraste adequado. Os campos vazios não ficam vermelhos antes da interação.

As três páginas foram testadas no Microsoft Edge em 1280, 992, 768, 576 e 375px, sem rolagem horizontal. As máscaras, a validação nativa, o cadastro válido, a dependência Estado/Cidade e o tratamento de erro foram verificados. A consulta real ao IBGE carregou 645 cidades de São Paulo. O validador Nu do W3C retornou 0 erros e 0 avisos em cada HTML.

As evidências, os scripts de verificação e as capturas estão na pasta `../verificacao`, fora do projeto entregue. O relatório está em `../RELATORIO-EXP2.md`. Os testes foram feitos no Edge; não representam uma verificação em todos os navegadores ou com leitor de tela. O envio segue sendo uma demonstração acadêmica sem backend.

## Experiência Prática III - Navegação SPA

A aplicação agora abre em `html/index.html` e usa rotas por hash: `#/inicio`, `#/projetos` e `#/cadastro`. As seções do submenu usam `#/projetos/campanhas` e `#/projetos/voluntariado`. Sem hash, a página mostra Início; uma rota desconhecida mostra “Página não encontrada”. O endereço `http://127.0.0.1:5500/` encaminha para a aplicação e conserva o hash informado.

O cabeçalho e o rodapé ficam na página principal. O conteúdo de cada rota está em um elemento `<template>` e a função `renderRoute()` limpa `<main id="app">` com `replaceChildren()` antes de inserir uma cópia do template. O evento `hashchange` atualiza a tela quando o usuário clica em um link, digita um hash ou usa Voltar/Avançar. A função também ajusta o título, `aria-current` e o foco. O formulário e o modal recebem seus listeners quando seus elementos são inseridos na rota, sem duplicar listeners globais do menu.

Os arquivos `html/projetos.html` e `html/cadastro.html` continuam disponíveis como versões estáticas das páginas anteriores; não são usados para carregar as rotas da SPA. A aplicação permanece sem framework e sem backend. O envio do formulário continua sendo uma demonstração local.

### Módulos JavaScript ES6

`html/index.html` carrega apenas `js/main.js` como módulo da aplicação, além do Chart.js pelo CDN. `main.js` inicia o menu e o roteador da SPA. Os módulos se dividem assim:

- `router.js`: lê o hash, troca o template da rota, atualiza título, navegação e foco.
- `menu.js`: controla o menu e o submenu em telas maiores e menores.
- `modal.js`: abre e fecha o diálogo de participação.
- `formulario.js`: aplica máscaras, valida os campos, carrega cidades e coordena o cadastro.
- `storage.js`: salva e recupera o cadastro local na chave `ongEsperancaCadastro`.
- `api.js`: consulta e ordena as cidades da API do IBGE.
- `projetos.js`: guarda os dados dos projetos e cria os cards a partir do template.
- `grafico.js`: monta e destrói o gráfico com base nos dados dos projetos.

As páginas estáticas anteriores continuam apontando para `js/script.js`. Esse arquivo é apenas uma pequena entrada de compatibilidade que importa `main.js`; não mantém uma segunda cópia das funcionalidades.

### Templates dinâmicos de projetos

Na rota Projetos, o array `projetos` em `js/projetos.js` contém três ações relacionadas às campanhas de alimentos e roupas e ao voluntariado. A função `renderizarProjetos()` percorre os dados, clona `#template-card-projeto`, preenche título, descrição, categoria, status e link, e adiciona cada card a `#lista-projetos`. Os textos são inseridos com `textContent`. A lista é limpa com `replaceChildren()` antes da geração, evitando cards duplicados quando a rota é aberta novamente. Os cards usam os estilos de Grid e badge já existentes.

### Persistência local do cadastro

Ao enviar um cadastro válido na SPA, `coletarDados()` em `formulario.js` reúne nome, e-mail, telefone, CEP, endereço, número, Estado, Cidade e forma de participação em um objeto. `salvarCadastro()` em `storage.js` usa `JSON.stringify()` e `localStorage.setItem()` para gravá-lo na chave `ongEsperancaCadastro`. CPF e data de nascimento não são armazenados. O aviso antes do botão informa que os dados serão guardados apenas neste navegador; o formulário continua sem envio a um servidor.

Quando a rota Cadastro entra no DOM, `restaurarCadastro()` em `formulario.js` chama `carregarCadastroSalvo()` de `storage.js`, que usa `localStorage.getItem()` e `JSON.parse()` para recuperar o objeto. Ela preenche os campos e carrega a lista de cidades depois de selecionar o Estado, antes de tentar selecionar a Cidade salva. Se a Cidade não existir na lista, deixa a seleção vazia. Um JSON inválido é removido com `removeItem()` e o formulário continua vazio. A restauração não apresenta sucesso de envio nem marca os campos como erro. Não há botão de limpeza; `removeItem()` é usado somente para dados corrompidos.

### Gráfico com Chart.js

A rota Projetos mostra um gráfico de barras com a quantidade de cards por categoria. O script Chart.js 4.5.1 é carregado pelo CDN jsDelivr no `html/index.html`, com `defer` antes de `main.js`, que é um módulo. `inicializarGraficoProjetos()` em `grafico.js` conta as categorias do array `projetos`, escreve os valores também em texto e cria o gráfico com `new Chart(...)` depois que o template Projetos entra no DOM. Ao trocar de rota, a instância é destruída antes de remover o canvas; isso evita gráficos duplicados ao voltar. Se a biblioteca não carregar, o resumo textual permanece e uma mensagem informa que o gráfico está indisponível. O canvas usa um contêiner próprio para acompanhar a largura da tela.

## Experiência Prática IV - Git e GitHub

O código é mantido no repositório público [cleber-pavin/ong-esperanca-frontend](https://github.com/cleber-pavin/ong-esperanca-frontend). A branch `main` continua como referência da versão estável da Experiência III, enquanto o trabalho da Experiência IV é integrado em `develop`.

### GitFlow

A branch `main` preserva versões estáveis, `develop` integra o trabalho em andamento e cada alteração é isolada em uma branch `feature/*`. As features concluídas são revisadas em Pull Requests antes da integração em `develop`.

### Conventional Commits

As mensagens identificam o tipo da alteração. O histórico real usa `chore:` para manutenção e versionamento, `docs:` para documentação e `merge:` para integrações explícitas anteriores. Exemplos incluem `chore: registra versão estável da Experiência III` e `docs: documenta gestão colaborativa do repositório`.

### Semantic Versioning

As versões seguem o formato `MAJOR.MINOR.PATCH`: `MAJOR` para mudanças incompatíveis, `MINOR` para funcionalidades compatíveis e `PATCH` para correções compatíveis. A tag anotada `v1.0.0` identifica a versão estável da Experiência III em `main`; não há outra release publicada.

### Issues, Milestones e Pull Requests

O milestone aberto `Experiência Prática IV` agrupa a Issue `#1`, concluída após a documentação da gestão do repositório, e a Issue `#2`, ainda aberta para a futura revisão de acessibilidade WCAG 2.1 AA. O Pull Request `#3` integrou `feature/gestao-repositorio` em `develop` após a revisão do diff.
