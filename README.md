
# 🍅 Jornal de Receitas

Sistema web completo para gerenciamento e compartilhamento de receitas culinárias, com design inspirado em jornais brasileiros dos anos 50 e 60.

> 🔗 **Acesse online:** https://jornaldereceitas.vercel.app/

---

## 📋 Sobre o projeto

O **Jornal de Receitas** é uma aplicação web que permite que usuários cadastrem, compartilhem e encontrem receitas culinárias. O sistema conta com dois níveis de acesso (usuário comum e administrador), sistema de aprovação de receitas enviadas, favoritos, filtros de busca, notificações em tempo real e um painel administrativo completo.

O visual é inspirado em jornais impressos clássicos, com identidade em vinho (`#8b0000`) e dourado (`#d4af37`), tipografia serifada (DM Serif Display, Playfair Display) e cards em estilo brutalist suavizado.

---

## 🏗️ Arquitetura e Padrões de Projeto

O projeto segue o padrão **MVC** no backend, com separação em camadas (`Controller → Service → DAO → Model`), e um frontend **SPA (Single Page Application)** em React consumindo a API REST.

Implementa os seguintes Design Patterns:

### DAO (Data Access Object)

Abstrai o acesso ao banco com interfaces (`IReceitaDAO`, `IUsuarioDAO`, `ICarrosselDAO`, `IFavoritoDAO`, `INotificacaoDAO`, `IEstatisticasDAO`, `ISiteConfigDAO`) e implementações específicas (`ReceitaDAOImpl`, `UsuarioDAOImpl`, etc.).

Os Services dependem apenas das interfaces, permitindo trocar a tecnologia de persistência sem alterar a lógica de negócio.

### MVC (Model-View-Controller)

- **Model:** entidades JPA (`Receita`, `Usuario`, `Favorito`, `Notificacao`, `Estatisticas`, `CarrosselItem`, `SiteConfig`).
- **View:** SPA em React (Vite + React Router).
- **Controller:** expõe endpoints REST, delega aos Services e retorna JSON.

### Command

Encapsula operações de negócio como objetos:

- `AprovarReceitaCommand`
- `RejeitarReceitaCommand`
- `ExcluirReceitaCommand`
- `AtualizarEstatisticasCommand`

Esses comandos são executados pelo `CommandInvoker`, sem que ele conheça os detalhes internos de cada operação.

### Factory Method

Centraliza a criação de objetos complexos:

- `ReceitaFactory`
- `NotificacaoFactory`
- `UsuarioFactory`

Reduz duplicação e deixa explícitas as regras de criação.

### Builder

Constrói objetos passo a passo:

- `ReceitaBuilder`
- `UsuarioBuilder`
- `NotificacaoBuilder`
- `FavoritoBuilder`
- `CarrosselBuilder`
- `EstatisticasBuilder`
- `SiteConfigBuilder`

Torna a configuração dos objetos mais legível e flexível.

### Decorator (Padrão Estrutural)

Implementado para o cálculo dinâmico da **complexidade das receitas**. A estrutura segue o padrão GoF clássico:

| Papel | Implementação |
|---|---|
| Component | `CalculadoraDeComplexidade` (interface) |
| ConcreteComponent | `CalculadoraBase` (retorna complexidade inicial – nível 1, "Fácil", pontuação 0) |
| Decorator | `CalculadoraDecorator` (classe abstrata que envolve um Component) |
| ConcreteDecorators | `DecoratorPorIngredientes`, `DecoratorPorModoPreparo`, `DecoratorPorTempoPreparo`, `DecoratorPorCategoria` |

A interface `CalculadoraDeComplexidade` define o contrato `calcular(Receita): Complexidade`.

A `CalculadoraBase` implementa essa interface e é o componente concreto básico, devolvendo sempre uma complexidade inicial.

A `CalculadoraDecorator` também implementa a interface e mantém uma referência interna para outra `CalculadoraDeComplexidade`, servindo de base para os decorators concretos, que herdam dela e acrescentam critérios específicos (ingredientes, passos, tempo e categoria) ao cálculo.

O **ComplexidadeService** é responsável por montar a cadeia de decorators dinamicamente em tempo de execução:

```java
CalculadoraDeComplexidade calculadora = new CalculadoraBase();
calculadora = new DecoratorPorIngredientes(calculadora);
calculadora = new DecoratorPorModoPreparo(calculadora);
calculadora = new DecoratorPorTempoPreparo(calculadora);
calculadora = new DecoratorPorCategoria(calculadora);
```

Cada decorator adiciona uma pontuação específica baseada nas características da receita (quantidade de ingredientes, número de passos, tempo de preparo e categoria).

O resultado final é um objeto `Complexidade` com nível (Fácil, Média, Difícil), descrição e pontuação.

O padrão não utiliza frameworks (é puramente POJO), garantindo que a lógica de negócio seja totalmente testável e independente do Spring.

---

## 🧠 Aplicação dos Princípios SOLID

O projeto foi arquitetado para respeitar os cinco princípios do SOLID, tanto na estrutura geral quanto nos padrões de projeto utilizados.

### SRP — Single Responsibility Principle

**Princípio da Responsabilidade Única**

Cada classe tem uma responsabilidade única e bem definida:

- **Controllers:** cuidam exclusivamente do tráfego HTTP: recebem requisições, validam parâmetros básicos, chamam Services e retornam respostas (ex.: `ReceitaController`, `UsuarioController`).
- **Services:** orquestram regras de negócio, combinando DAOs, factories, builders e commands (ex.: `ReceitaService`, `FavoritoService`, `ComplexidadeService`).
- **DAOs:** isolam o acesso ao banco de dados (`ReceitaDAOImpl`, `UsuarioDAOImpl`), evitando lógica de negócio nessa camada.
- **Commands:** encapsulam ações de negócio específicas e complexas (como `AprovarReceitaCommand`, `RejeitarReceitaCommand`) em classes separadas.

Isso facilita testes e manutenção, porque cada classe tem um motivo claro para mudar.

### OCP — Open/Closed Principle

**Princípio Aberto/Fechado**

O código está aberto para extensão e fechado para modificação principalmente via Decorator e Command:

- **Decorator:** é possível adicionar novos critérios de cálculo criando um novo decorator e encaixando-o na cadeia, sem alterar o código dos decorators existentes nem do `ComplexidadeService`.
- **Command:** novas operações de negócio (por exemplo, um novo tipo de moderação de receita) podem ser adicionadas criando uma nova classe de comando que implementa `Command`, sem alterar o `CommandInvoker`.

Isso torna a evolução das regras de negócio mais segura e controlada.

### LSP — Liskov Substitution Principle

**Princípio da Substituição de Liskov**

Todos os decorators (`CalculadoraBase`, `DecoratorPorIngredientes`, `DecoratorPorModoPreparo`, `DecoratorPorTempoPreparo`, `DecoratorPorCategoria`) implementam a mesma interface `CalculadoraDeComplexidade`.

Isso permite que qualquer um deles seja usado no lugar da interface sem quebrar o contrato:

- O método de todos é sempre `calcular(Receita): Complexidade`.
- O tipo de retorno e o comportamento esperado (devolver um `Complexidade` válido) são consistentes.
- Da mesma forma, as implementações de `Command` (`AprovarReceitaCommand`, `RejeitarReceitaCommand`, etc.) podem ser usadas polimorficamente onde se espera um `Command`.

### ISP — Interface Segregation Principle

**Princípio da Segregação de Interfaces**

As interfaces foram desenhadas específicas o suficiente para evitar "interfaces gordas":

- Cada DAO tem sua própria interface específica (`IReceitaDAO`, `IUsuarioDAO`, `IFavoritoDAO`, `INotificacaoDAO`, `IEstatisticasDAO`, `ISiteConfigDAO`), em vez de uma interface genérica com métodos que nem todas as entidades usariam.
- Os Services consomem apenas os métodos que realmente necessitam de cada DAO.

Isso reduz o acoplamento e evita dependências desnecessárias entre classes.

### DIP — Dependency Inversion Principle

**Princípio da Inversão de Dependência**

Os módulos de alto nível dependem de abstrações, não de implementações concretas:

- Os Services dependem das interfaces dos DAOs (`IReceitaDAO`, `IUsuarioDAO`, etc.), e não de classes concretas. Isso permite trocar a implementação do DAO (por exemplo, de JPA para outra tecnologia) sem alterar a lógica de negócio.
- O `ComplexidadeService` depende da abstração `CalculadoraDeComplexidade`. Ele não sabe se está usando só a `CalculadoraBase` ou uma cadeia com vários decorators; ele apenas chama `calcular(Receita)` na interface.

Essa inversão de dependência facilita testes (com mocks) e futuras trocas de tecnologia.

---

## 🧹 Object Calisthenics (Calistenia de Objetos) e Decisões Conscientes

O projeto buscou aplicar os princípios de Calistenia de Objetos, focando em:

- Métodos curtos.
- Responsabilidade única por classe (coerente com SRP).
- Retorno precoce de métodos (evitando `else` aninhados desnecessários).
- Uso de objetos de domínio para encapsular regras em vez de espalhar `ifs` pelo código.

Como este é um projeto Spring Boot real, algumas regras foram conscientemente flexibilizadas para manter a compatibilidade com o ecossistema:

- **Regra 9 (Sem Getters/Setters):** utilizamos o Lombok para gerar getters/setters nas entidades JPA. Isso é um padrão consolidado do mercado para evitar verbosidade e facilitar a integração com bibliotecas como Hibernate e Jackson.
- **Regras 3 e 4 (Tipos primitivos e coleções):** não encapsulamos tipos como `String ingredientes` em classes como `Ingredientes`, porque o banco de dados já armazena como `TEXT`. A abstração extra geraria complexidade desnecessária no mapeamento JPA.
- **Regra 8 (Máximo 2 variáveis de instância):** alguns Services e Controllers possuem mais de duas dependências para manter a coesão das operações de negócio (ex.: `ReceitaController`), o que é aceitável no contexto de uma aplicação Spring.

---

## 🔌 Padrões REST API e Documentação (Swagger)

A API foi construída seguindo os princípios REST, utilizando os verbos HTTP (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) de forma semântica para operações de CRUD, URLs baseadas em substantivos no plural (`/api/receitas`, `/api/usuarios`) e códigos de status HTTP adequados (`200`, `201`, `400`, `401`, `404`).

Para operações de negócio que não se encaixam no CRUD tradicional (como `POST /api/receitas/{id}/aprovar` e `POST /api/carrossel/toggle/{id}`), adotou-se o padrão RPC (Remote Procedure Call), que é amplamente utilizado no mercado para expressar ações de domínio de forma explícita, mantendo a clareza do contrato da API.

A documentação está totalmente integrada com o **SpringDoc OpenAPI** e disponível via **Swagger UI**.

**Acesso online:** `/swagger-ui/index.html` (via proxy no frontend).

### Cobertura da documentação

**38 endpoints REST documentados**, agrupados em 5 tags:

| Grupo | Endpoints documentados |
|---|---|
| Usuários | Cadastro, login, logout, buscar usuário logado, editar perfil, listar usuários, buscar por ID, editar usuário, ativar/desativar, excluir |
| Receitas | Listar aprovadas (home), listar minhas, listar pendentes, listar rejeitadas, listar aprovadas (admin), buscar por ID, criar, editar, aprovar, rejeitar, excluir |
| Favoritos | Adicionar, remover, listar, resumo geral, resumo por ingrediente |
| Notificações | Listar todas, listar não lidas, contador, marcar como lida, marcar todas como lidas, excluir todas |
| Carrossel | Listar ativos (público), listar todos (admin), adicionar, editar, alternar status, excluir |

### Recursos implementados na documentação

- `@Tag` em todos os Controllers (5 grupos organizados).
- `@Operation` com `summary` e `description` em todos os 38 endpoints.
- `@ApiResponses` com `@Content` e exemplos reais de resposta.
- `@Parameter` em todos os path variables e query params (com descrição e exemplo).
- `@Schema` em todos os models (`Usuario`, `Receita`, `CarrosselItem`, `Notificacao`, `Favorito`).
- `@SecurityRequirement` nos endpoints autenticados (cookie de sessão).
- `multipart/form-data` correto nos endpoints de upload de imagem.

---

## 🧪 Testes Unitários Automatizados

O projeto conta com uma suíte de testes unitários implementados com **JUnit 5**, **Mockito** e **AssertJ**, seguindo o padrão **AAA (Arrange, Act, Assert)**.

### JUnit 5

Usado para estruturar os testes:

- Anotações como `@Test`, `@BeforeEach`, `@DisplayName`.
- Integração com Maven (plugin Surefire) via `mvn test`.

### Mockito

Usado para criar mocks (objetos simulados) de DAOs e Services:

- `mock(...)`
- `when(...).thenReturn(...)`
- `verify(...)`
- `verifyNoInteractions(...)`

Permite testar a lógica de Services e Commands isoladamente, sem acessar o banco ou subir o contexto completo.

### AssertJ

Usado para asserções fluentes e legíveis:

```java
assertThat(resultado.getDescricao()).isEqualTo("Difícil");
assertThat(resultado.getPontuacao()).isZero();

assertThatThrownBy(() -> service.excluir(999L))
    .isInstanceOf(RuntimeException.class)
    .hasMessage("Receita não encontrada");
```

### Cobertura dos testes

**Decorator de complexidade**

Testes isolados para cada decorator (`CalculadoraBaseTest`, `DecoratorPorIngredientesTest`, `DecoratorPorModoPreparoTest`, `DecoratorPorTempoPreparoTest`, `DecoratorPorCategoriaTest`) e teste da cadeia completa (`CalculadoraCompletaTest`, `ComplexidadeServiceTest`), garantindo que a soma de pontos e a conversão em nível/descrição estejam corretas.

**Models, Builders e Factories**

`ReceitaTest`, `UsuarioTest`, `EstatisticasTest`, `ReceitaBuilderTest`, `UsuarioBuilderTest`, `ReceitaFactoryTest`, `UsuarioFactoryTest` verificam regras de negócio dentro das entidades (como `Receita.aprovar()` e `Usuario.editarPerfil()`) e a construção correta de objetos mais complexos.

**Commands**

`AprovarReceitaCommandTest`, `RejeitarReceitaCommandTest`, `ExcluirReceitaCommandTest`, `AtualizarEstatisticasCommandTest` testam a orquestração das operações de aprovação, rejeição, exclusão de receitas e atualização de estatísticas, verificando mudanças de estado, chamadas aos Services e geração de notificações.

**Services**

`ReceitaServiceTest`, `FavoritoServiceTest`, `NotificacaoServiceTest`, `UsuarioServiceTest`, `AuthServiceTest`, `CarrosselServiceTest`, `UploadServiceTest`, `ComplexidadeServiceTest` validam a lógica de negócio de cada serviço isoladamente, com DAOs mockados.

**DAO específico**

Testes em `FavoritoDAOImplTest` para persistência e idempotência de operações de favoritos.

### Execução dos testes

Para rodar todos os testes:

```bash
mvn test
```

---

## ✨ Funcionalidades

### 👤 Autenticação e Usuários

- Cadastro de novos usuários.
- Login e logout seguro.
- Edição de perfil (nome, e-mail, telefone, gênero e senha).
- Dois níveis de acesso: `USER` e `ADMIN`.
- Ativação e desativação de contas pelo administrador.

### 📖 Receitas

Envio de receitas com:

- Título.
- Tempo de preparo.
- Quantidade de porções.
- Nome do chefe.
- Categoria (Salgado ou Doce).
- Ingredientes.
- Modo de preparo.
- Imagem.

Outras funcionalidades:

- Sistema de aprovação: receitas enviadas permanecem pendentes até a aprovação do administrador.
- Listagem de receitas aprovadas separadas por categoria (Salgados e Doces).
- Visualização detalhada com checklist interativo de ingredientes e passos numerados.
- Opção de favoritar e desfavoritar receitas.
- Aba dedicada às receitas favoritas.
- Exclusão de receitas pelo próprio usuário.

### ❤️ Favoritos

- Adicionar e remover receitas dos favoritos.
- Aba dedicada com todas as receitas favoritadas.
- Modal de resumo dos favoritos, apresentando:
  - Total de receitas favoritas.
  - Ingredientes disponíveis.
  - Ingredientes que se repetem entre diferentes receitas.
- Busca dinâmica por ingrediente:
  - Seleção de ingredientes por meio de um select.
  - Consulta em tempo real da quantidade de receitas favoritas que contêm o ingrediente selecionado.
  - Listagem dos títulos das receitas correspondentes.

### 🔍 Busca e Filtros

- Filtros por nome, categoria e porções na tela inicial.
- Busca paginada nas telas administrativas.

### 🔔 Notificações em Tempo Real

- Notificações de novas receitas enviadas.
- Notificações de receitas aprovadas e rejeitadas.
- Notificações ao favoritar e desfavoritar receitas.
- Notificações de receitas excluídas.
- Contador de notificações não lidas no cabeçalho.
- Marcação individual ou coletiva das notificações como lidas.
- Toasts para feedback visual das ações realizadas.
- Polling a cada 10 segundos, permitindo a atualização automática das notificações e dos dados sem necessidade de recarregar a página.

### 🎠 Carrossel

Gerenciamento completo pelo administrador:

- Adicionar itens.
- Editar itens.
- Ativar e desativar itens.
- Excluir itens.
- Suporte a imagens por URL ou upload de arquivo.
- Atualização automática por polling.

### 👑 Painel Administrativo

**Dashboard**

- Cards com indicadores de usuários, receitas por status e favoritos.
- Gráficos de distribuição das receitas por status.
- Ranking das 5 receitas mais favoritadas.

**Gerenciamento de Usuários**

- Listagem paginada.
- Busca de usuários.
- Edição e exclusão.
- Ativação e desativação de contas.

**Receitas Pendentes**

- Listagem e busca.
- Visualização em modal.
- Edição.
- Aprovação e rejeição.

**Receitas Aprovadas**

- Listagem e busca.
- Visualização em modal.
- Edição e exclusão.

**Receitas Rejeitadas**

- Listagem e busca.
- Visualização em modal.
- Consulta do motivo da rejeição.

**Outros Recursos**

- Gerenciamento dos itens do carrossel exibido na página inicial.
- Edição do perfil do administrador.
- Sidebar responsiva com overlay em dispositivos móveis.

### 🎨 Interface

- Design responsivo para dispositivos móveis, tablets e desktops, com breakpoints dedicados.
- Cabeçalho fixo com estado `scrolled`, reduzindo seu tamanho durante a rolagem, exceto em telas específicas.
- Sidebar mobile com overlay e efeito de blur.
- Carrossel de receitas em destaque.
- Modais acessíveis utilizando um componente `<Modal>` genérico e reutilizável.
- Toasts de feedback utilizando PrimeReact Toast.
- Organização das receitas por abas.
- Pré-visualização de imagens antes do envio.
- Validação dos campos obrigatórios dos formulários.
- Loader global de página e spinners em botões de ação.
- Loader inline com três anéis giratórios para conteúdo dos modais.
- Checklist interativo de ingredientes, com marcação visual dos itens concluídos.
- Lazy loading de imagens com fallback "Imagem indisponível".
- Scrollbar personalizada, fina e moderna.
- Selo de complexidade da receita, inspirado em carimbos de jornal, exibido nos cards e na página de detalhes.

---

## 🛠️ Tecnologias

### Backend

| Tecnologia | Versão |
|---|---|
| Java | 21 |
| Spring Boot | 3.5.5 |
| Spring Security | 6.x |
| Hibernate | 6.6 |
| MySQL | 8.0 |
| Maven | 3.8+ |
| SpringDoc OpenAPI | 2.x |

### Frontend

| Tecnologia | Versão |
|---|---|
| React | 19 |
| Vite | 8 |
| React Router | 7 |
| Axios | 1.20 |
| PrimeReact | 10 |
| PrimeIcons | 7 |
| Font Awesome | 6.5 |
| Chart.js (via PrimeReact) | 4.x |
| HTML5 | — |
| CSS3 | — |

### Ferramentas e Infraestrutura

| Tecnologia | Finalidade |
|---|---|
| Docker | Conteinerização |
| GitHub | Versionamento de código |
| DigitalOcean | Hospedagem do backend |
| Vercel | Hospedagem do frontend |

---

## 🗄️ Banco de Dados

O sistema utiliza **MySQL** para persistência dos dados, com mapeamento objeto-relacional por meio do JPA/Hibernate.

### Tabelas

| Tabela | Descrição |
|---|---|
| `usuario` | Usuários cadastrados: nome, e-mail, CPF, senha, role e status de ativação. |
| `receita` | Receitas enviadas: título, ingredientes, modo de preparo, imagem, categoria e status. |
| `favorito` | Relacionamento entre usuários e receitas favoritadas. |
| `notificacao` | Notificações vinculadas aos usuários. |
| `estatisticas` | Estatísticas por usuário, incluindo receitas, favoritos e notificações. |
| `carrossel` | Itens exibidos no carrossel da página inicial. |
| `site_config` | Configurações dinâmicas do site, como favicon e imagens de destaque. |

### Relacionamentos

| Entidade de Origem | Cardinalidade | Entidade de Destino |
|---|---|---|
| `usuario` | 1:1 | `estatisticas` |
| `receita` | N:1 | `usuario` |
| `usuario` | 1:N | `favorito` |
| `usuario` | 1:N | `notificacao` |
| `receita` | 1:N | `favorito` |

### Tabelas Independentes

- **`carrossel`:** gerenciada exclusivamente pelo administrador, sem vínculo direto com usuários.
- **`site_config`:** armazena configurações globais do site, sem vínculo direto com usuários.

---

## 📐 Diagramas

O projeto possui diagramas UML para documentar sua arquitetura, os relacionamentos entre classes e os principais fluxos de execução.

### Diagramas de Classe

- **Domínio e Builders:** entidades, enums, builders e relacionamentos.
- **DAOs:** interfaces, implementações e repositórios `JpaRepository`.
- **Commands:** `Command`, `BaseCommand`, comandos concretos e `CommandInvoker`.
- **Decorator:** estrutura completa do padrão de projeto, incluindo:
  - Component (`CalculadoraDeComplexidade`).
  - ConcreteComponent (`CalculadoraBase`).
  - Decorator (`CalculadoraDecorator`).
  - ConcreteDecorators (`DecoratorPorIngredientes`, `DecoratorPorModoPreparo`, `DecoratorPorTempoPreparo`, `DecoratorPorCategoria`).
  - Cadeia de complexidade das receitas montada pelo `ComplexidadeService`.

📁 **Em:** `/Diagramas/Diagrama de Classe`

### Diagramas de Sequência

Os diagramas de sequência, desenvolvidos em PlantUML e exportados como imagens, representam fluxos de execução do sistema, como:

- **Autenticação:** cadastro, login, logout, buscar usuário logado.
- **Usuário:** editar perfil, editar usuário (admin), ativar/desativar, excluir.
- **Receita:** criar, editar, aprovar, rejeitar, excluir, listar aprovadas (home/admin), listar pendentes, rejeitadas, "minhas receitas".
- **Favorito:** favoritar, desfavoritar, listar favoritos, resumo por ingrediente.
- **Notificação:** listar notificações, não lidas, contador, marcar como lida/todas lidas, excluir todas.
- **Carrossel:** listar itens públicos e administrativos, adicionar, editar, alternar status, excluir.

Um exemplo importante é o diagrama de sequência **"Listar Receitas Aprovadas (home) - com Decorator"**, onde:

1. O visitante chama `GET /api/receitas`.
2. O `ReceitaController` chama `ReceitaService.listarAprovadas()`, que consulta `IReceitaDAO.listarPorStatus(APROVADA)`.
3. Para cada receita, o Controller chama `receitaParaMap(receita, true)`, que:
   - Usa o `FavoritoService` para contar curtidas.
   - Chama `ComplexidadeService.calcular(receita)`, que delega para a cadeia de decorators representada por `CalculadoraDeComplexidade`.
4. No fim, o Controller devolve `200 OK` com `{ receitas: [...] }`, incluindo favoritos e complexidade prontos para o frontend.

📁 **Em:** `/Diagramas/Diagramas de Sequência`

---

## 🔒 Segurança

O sistema implementa mecanismos de proteção para autenticação, autorização, persistência de dados e comunicação entre frontend e backend, usando principalmente **Spring Security**, **BCrypt**, **JPA/Hibernate** e uma configuração de **CORS** restrita ao frontend oficial.

### Como a segurança está configurada

- A classe `SecurityConfig` define a política de acesso:
  - Endpoints públicos: arquivos estáticos, Swagger (`/swagger-ui`, `/v3/api-docs`), cadastro e login (`/api/cadastro`, `/api/login`) e consulta do usuário logado (`/api/perfil/usuario-logado`).
  - Endpoints que exigem **usuário autenticado**: `/api/perfil/**`, `/api/receitas/minhas`, `/api/favoritos/**`, `/api/notificacoes/**` e demais rotas protegidas.
  - Endpoints **restritos ao ADMIN**: `/api/usuarios/**`, receitas pendentes/aprovadas/rejeitadas de admin, e todo o gerenciamento do carrossel administrativo (`/api/carrossel/admin`, `/api/carrossel/adicionar`, `/api/carrossel/editar/**`, `/api/carrossel/toggle/**`, `/api/carrossel/excluir/**`).
- O login/logout é feito via API (`/api/login`, `/api/logout`), com sessão mantida por cookie `JSESSIONID`. O formulário padrão do Spring (`formLogin`) e o HTTP Basic (`httpBasic`) são desabilitados.
- O CORS é configurado para permitir **apenas** as origens autorizadas (Vercel e `localhost:5173`), com envio de cookies habilitado (`allowCredentials = true`) e exposição do header `Set-Cookie`, garantindo que só o frontend oficial consiga consumir a API com sessão.

### Vulnerabilidades e Medidas de Proteção

| Vulnerabilidade           | Medida de Proteção                                                                                                                                              |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SQL Injection             | Uso de JPA/Hibernate com consultas parametrizadas e repositórios Spring Data, evitando concatenação de SQL manual.                                             |
| Senhas em texto puro      | Criptografia de senhas com **BCrypt** (`BCryptPasswordEncoder`), tanto no cadastro (`UsuarioService`) quanto na autenticação (`AuthService`).                  |
| Acesso não autorizado     | Spring Security com controle de acesso por **roles** (`USER` e `ADMIN`) em nível de URL, garantindo que rotas administrativas sejam acessíveis só por admin.   |
| Exposição de senhas em JSON | Campos de senha anotados com `@JsonIgnore` e `@Schema(accessMode = WRITE_ONLY)`, impedindo que hashes de senha sejam enviados em respostas da API.          |
| CSRF                      | API REST consumida por SPA separada, com proteção baseada em CORS restrito + sessão; o formulário padrão do Spring é desativado, e os endpoints de login/logout são explicitamente controlados. |
| CORS                      | Configuração de `CorsConfiguration` para aceitar apenas as origens definidas em `cors.allowed.origins` (Vercel + localhost), com métodos e headers controlados. |
| Segurança da sessão       | Sessão HTTP mantida via cookie `JSESSIONID`, com flags `HttpOnly` e `Secure` em produção, reduzindo risco de roubo de sessão por scripts no navegador.         |

---