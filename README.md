# 🍅 Jornal de Receitas

Sistema web completo para gerenciamento e compartilhamento de receitas culinárias, com design inspirado em jornais brasileiros dos anos 50 e 60.

> 🔗 **Acesse online:** (https://jornaldereceitas.vercel.app/)

---

## 📋 Sobre o projeto

O **Jornal de Receitas** é uma aplicação web que permite que usuários cadastrem, compartilhem e encontrem receitas culinárias. O sistema conta com dois níveis de acesso (usuário comum e administrador), sistema de aprovação de receitas enviadas, favoritos, filtros de busca, notificações em tempo real e um painel administrativo completo.

O visual é inspirado em jornais impressos clássicos, com identidade em vinho (`#8b0000`) e dourado (`#d4af37`), tipografia serifada (DM Serif Display, Playfair Display) e cards em estilo brutalist suavizado.

---

## 🏗️ Arquitetura e Padrões de Projeto

O projeto segue o padrão **MVC** no backend, com separação em camadas (Controller → Service → DAO → Model), e um frontend **SPA (Single Page Application)** em React consumindo a API REST. Implementa os seguintes Design Patterns:

### DAO (Data Access Object)
Abstrai o acesso ao banco com interfaces (`IReceitaDAO`, `IUsuarioDAO`, `ICarrosselDAO`, `IFavoritoDAO`, `INotificacaoDAO`, `IEstatisticasDAO`, `ISiteConfigDAO`) e implementações específicas (`ReceitaDAOImpl`, `UsuarioDAOImpl`, etc). Os Services dependem apenas das interfaces, permitindo trocar a tecnologia de persistência sem alterar a lógica de negócio.

### MVC (Model-View-Controller)
- **Model:** entidades JPA (`Receita`, `Usuario`, `Favorito`, `Notificacao`, `Estatisticas`, `CarrosselItem`, `SiteConfig`)
- **View:** SPA em React (Vite + React Router)
- **Controller:** expõe endpoints REST, delega aos Services e retorna JSON

### Command
Encapsula operações de negócio como objetos (`AprovarReceitaCommand`, `RejeitarReceitaCommand`, `ExcluirReceitaCommand`, `AtualizarEstatisticasCommand`), executados pelo `CommandInvoker` sem que este conheça os detalhes internos de cada operação.

### Factory Method
Centraliza a criação de objetos complexos (`ReceitaFactory`, `NotificacaoFactory`, `UsuarioFactory`), reduzindo duplicação e deixando explícitas as regras de criação.

### Builder
Constrói objetos passo a passo (`ReceitaBuilder`, `UsuarioBuilder`, `NotificacaoBuilder`, `FavoritoBuilder`, `CarrosselBuilder`, `EstatisticasBuilder`, `SiteConfigBuilder`), tornando a configuração mais legível e flexível.

### Decorator (Padrão Estrutural)
Implementado para o cálculo dinâmico da **complexidade das receitas**. A estrutura segue o padrão GoF clássico:
- **Component:** `CalculadoraDeComplexidade` (interface)
- **ConcreteComponent:** `CalculadoraBase` (retorna complexidade zero)
- **Decorator:** `CalculadoraDecorator` (classe abstrata que envolve um Component)
- **ConcreteDecorators:** `DecoratorPorIngredientes`, `DecoratorPorModoPreparo`, `DecoratorPorTempoPreparo`, `DecoratorPorCategoria`.

O **ComplexidadeService** é responsável por montar a cadeia de decorators dinamicamente em tempo de execução. Cada decorator adiciona uma pontuação específica baseada nas características da receita (quantidade de ingredientes, número de passos, tempo de preparo e categoria). O resultado final é um objeto `Complexidade` com nível (Fácil, Média, Difícil), descrição e pontuação. O padrão **não utiliza frameworks** (é puramente POJO), garantindo que a lógica de negócio seja totalmente testável e independente do Spring.

---

## 🧠 Aplicação dos Princípios SOLID

O projeto foi arquitetado para respeitar os cinco princípios do SOLID:

- **SRP (Single Responsibility Principle):** Cada classe tem uma responsabilidade única e bem definida. Controllers cuidam exclusivamente do tráfego HTTP; Services orquestram regras de negócio; DAOs isolam o acesso ao banco; e os Commands encapsulam ações complexas (como `AprovarReceitaCommand`).
- **OCP (Open-Closed Principle):** O padrão **Decorator** é a prova viva do OCP. É possível adicionar novos critérios de complexidade criando novos decorators, sem alterar o código dos decorators existentes ou do `ComplexidadeService`.
- **LSP (Liskov Substitution Principle):** Todos os decorators (`CalculadoraBase`, `DecoratorPorIngredientes`, etc.) implementam a mesma interface `CalculadoraDeComplexidade`. Qualquer um deles pode substituir o outro na cadeia sem quebrar o contrato (o retorno é sempre uma `Complexidade`), garantindo que o sistema nunca falhe por polimorfismo.
- **ISP (Interface Segregation Principle):** Os DAOs utilizam interfaces específicas por entidade (`IReceitaDAO`, `IUsuarioDAO`), evitando uma interface genérica e garantindo que as classes dependam apenas dos métodos que realmente usam.
- **DIP (Dependency Inversion Principle):** Os Services de alto nível dependem estritamente das **interfaces** dos DAOs (ex: `IReceitaDAO`), e não de implementações concretas. O `ComplexidadeService` depende da abstração `CalculadoraDeComplexidade`. Isso permite trocar a tecnologia de persistência sem impactar as regras de negócio.

---

## 🧹 Object Calisthenics (Calistenia de Objetos) e Decisões Conscientes

O projeto buscou aplicar os princípios de Calistenia de Objetos, focando em métodos curtos, responsabilidade única (SRP) e retorno precoce (evitando `else`). No entanto, como este é um projeto Spring Boot real, algumas regras foram **conscientemente flexibilizadas** para manter a compatibilidade com o ecossistema:

- **Regra 9 (Sem Getters/Setters):** Utilizamos o Lombok para gerar getters/setters nas entidades JPA. Isso é um padrão consolidado do mercado para evitar verbosidade e facilitar a integração com bibliotecas como Hibernate e Jackson.
- **Regra 3 e 4 (Tipos primitivos e coleções):** Não encapsulamos tipos como `String ingredientes` em classes como `Ingredientes` porque o banco de dados já armazena como `TEXT`. A abstração extra geraria complexidade desnecessária no mapeamento JPA.
- **Regra 8 (Máximo 2 variáveis de instância):** Alguns Services e Controllers possuem mais de duas dependências para manter a coesão das operações de negócio (ex: `ReceitaController`).

---

## 🔌 Padrões REST API e Documentação (Swagger)

A API foi construída seguindo os princípios REST, utilizando os verbos HTTP (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) de forma semântica para operações de CRUD, URLs baseadas em substantivos no plural (`/api/receitas`, `/api/usuarios`) e códigos de status HTTP adequados (`200`, `201`, `400`, `401`, `404`).

Para operações de negócio que não se encaixam no CRUD tradicional (como `POST /api/receitas/{id}/aprovar` e `POST /api/carrossel/toggle/{id}`), adotou-se o padrão **RPC (Remote Procedure Call)**, que é amplamente utilizado no mercado para expressar ações de domínio de forma explícita, mantendo a clareza do contrato da API.

A documentação está totalmente integrada com o **SpringDoc OpenAPI** e disponível via **Swagger UI**.

**Acesso online:** [`/swagger-ui/index.html`](https://jornaldereceitas.vercel.app/swagger-ui/index.html)

### Cobertura da documentação

**38 endpoints REST documentados**, agrupados em 5 tags:

| Grupo | Endpoints documentados |
|---|---|
| **Usuários** | cadastro, login, logout, buscar usuário logado, editar perfil, listar usuários, buscar por ID, editar usuário, ativar/desativar, excluir |
| **Receitas** | listar aprovadas (home), listar minhas, listar pendentes, listar rejeitadas, listar aprovadas (admin), buscar por ID, criar, editar, aprovar, rejeitar, excluir |
| **Favoritos** | adicionar, remover, listar, resumo geral, resumo por ingrediente |
| **Notificações** | listar todas, listar não lidas, contador, marcar como lida, marcar todas como lidas, excluir todas |
| **Carrossel** | listar ativos (público), listar todos (admin), adicionar, editar, alternar status, excluir |

### Recursos implementados na documentação

- ✅ `@Tag` em todos os controllers (5 grupos organizados)
- ✅ `@Operation` com summary e description em todos os 38 endpoints
- ✅ `@ApiResponses` com `@Content` e exemplos reais de resposta
- ✅ `@Parameter` em todos os path variables e query params (com descrição e exemplo)
- ✅ `@Schema` em todos os models (`Usuario`, `Receita`, `CarrosselItem`, `Notificacao`, `Favorito`)
- ✅ `@SecurityRequirement` nos endpoints autenticados (cookie de sessão)
- ✅ `multipart/form-data` correto nos endpoints de upload de imagem

---

## 🧪 Testes Unitários Automatizados

O projeto conta com uma suíte de **153 testes unitários** implementados com **JUnit 5**, **Mockito** e **AssertJ**, seguindo o padrão **AAA (Arrange, Act, Assert)**.

### Cobertura dos testes
- **Decorator (34 testes):** Testes isolados para cada decorator (Base, Ingredientes, Modo de Preparo, Tempo, Categoria) e o teste da cadeia completa (CalculadoraCompletaTest).
- **Models (43 testes):** Validação de regras de negócio (`Receita.aprovar()`, `Usuario.editarPerfil()`, etc.).
- **Commands (10 testes):** Orquestração dos comandos (Aprovar, Rejeitar, Excluir, AtualizarEstatísticas).
- **Services (33 testes):** Lógica de serviços (FavoritoService, NotificacaoService, ReceitaService, CarrosselService, AuthService, UploadService).
- **DAOs (5 testes):** Testes de idempotência e persistência (FavoritoDAOImpl).
- **Factories e Builders (15 testes):** Testes de criação de objetos complexos.
- **Contexto (1 teste):** Teste de carregamento do contexto Spring Boot.

---


## ✨ Funcionalidades

### 👤 Autenticação e Usuários

- Cadastro de novos usuários.
- Login e logout seguro.
- Edição de perfil (nome, e-mail, telefone, gênero e senha).
- Dois níveis de acesso: `USER` e `ADMIN`.
- Ativação e desativação de contas pelo administrador.

### 📖 Receitas

- Envio de receitas com:
  - Título.
  - Tempo de preparo.
  - Quantidade de porções.
  - Nome do chefe.
  - Categoria (Salgado ou Doce).
  - Ingredientes.
  - Modo de preparo.
  - Imagem.
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
  - Seleção de ingredientes por meio de um `select`.
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

- Gerenciamento completo pelo administrador:
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
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" width="24"> Java | 21 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" width="24"> Spring Boot | 3.5.5 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" width="24"> Spring Security | 6.x |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hibernate/hibernate-original.svg" width="24"> Hibernate | 6.6 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" width="24"> MySQL | 8.0 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg" width="24"> Maven | 3.8+ |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" width="24"> SpringDoc OpenAPI | 2.x |

### Frontend

| Tecnologia | Versão |
|---|---|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="24"> React | 19 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" width="24"> Vite | 8 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/reactrouter/reactrouter-original.svg" width="24"> React Router | 7 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/axios/axios-plain.svg" width="24"> Axios | 1.20 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prime/prime-original.svg" width="24"> PrimeReact | 10 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prime/prime-original.svg" width="24"> PrimeIcons | 7 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fontawesome/fontawesome-original.svg" width="24"> Font Awesome | 6.5 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg" width="24"> Chart.js (via PrimeReact) | 4.x |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="24"> HTML5 | — |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="24"> CSS3 | — |

### Ferramentas e Infraestrutura

| Tecnologia | Finalidade |
|---|---|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="24"> Docker | Conteinerização |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="24"> GitHub | Versionamento de código |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg" width="24"> DigitalOcean | Hospedagem do backend |
| Vercel | Hospedagem do frontend |

---

## 🗄️ Banco de Dados

O sistema utiliza MySQL para persistência dos dados, com mapeamento objeto-relacional por meio do JPA/Hibernate.

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
| `receita` | N:1 | `favorito` |

### Tabelas Independentes

- **`carrossel`**: gerenciada exclusivamente pelo administrador, sem vínculo direto com usuários.
- **`site_config`**: armazena configurações globais do site, sem vínculo direto com usuários.

---

## 📐 Diagramas

O projeto possui diagramas UML para documentar sua arquitetura, os relacionamentos entre classes e os principais fluxos de execução.

### Diagramas de Classe

- **Domínio e Builders:** entidades, enums, builders e relacionamentos.
- **DAOs:** interfaces, implementações e repositórios `JpaRepository`.
- **Commands:** `Command`, `BaseCommand`, comandos concretos e `CommandInvoker`.
- **Decorator:** estrutura completa do padrão de projeto, incluindo:
  - Component.
  - ConcreteComponent.
  - Decorator.
  - ConcreteDecorators.
  - Cadeia de complexidade das receitas.

📁 Em [`/Diagramas/Diagrama de Classe`](./Diagramas/Diagrama%20de%20Classe)

### Diagramas de Sequência

O projeto conta com diagramas de sequência desenvolvidos em PlantUML, organizados por domínio e representando os fluxos de execução do sistema.

**Autenticação (3)**
- Cadastro.
- Login.
- Logout.

**Usuário (5)**
- Buscar usuário logado.
- Editar perfil.
- Editar usuário (administrador).
- Ativar/desativar usuário.
- Excluir usuário.

**Receita (11)**
- Criar receita.
- Editar receita.
- Aprovar receita.
- Rejeitar receita.
- Excluir receita.
- Listar receitas aprovadas (home).
- Listar receitas aprovadas — Decorator (home).
- Minhas receitas.
- Listar receitas pendentes (admin).
- Listar receitas rejeitadas (admin).
- Listar receitas aprovadas (admin).

**Favorito (3)**
- Favoritar receita.
- Desfavoritar receita.
- Listar favoritos.

**Notificação**
- Listar notificações.
- Listar notificações não lidas.
- Consultar contador de notificações.
- Marcar notificação como lida.
- Marcar todas as notificações como lidas.
- Excluir todas as notificações.

**Carrossel (6)**
- Listar itens públicos.
- Listar itens administrativos.
- Adicionar item.
- Editar item.
- Alternar status.
- Excluir item.

📁 Em [`/Diagramas/Diagramas de Sequência`](./Diagramas/Diagramas%20de%20Sequência)

---

## 🔒 Segurança

O sistema implementa mecanismos de proteção para autenticação, autorização, persistência de dados e comunicação entre frontend e backend.

### Vulnerabilidades e Medidas de Proteção

| Vulnerabilidade | Medida de Proteção |
|---|---|
| SQL Injection | JPA/Hibernate com consultas parametrizadas. |
| Senhas em texto puro | Criptografia de hash com BCrypt (`BCryptPasswordEncoder`). |
| Acesso não autorizado | Spring Security com controle de acesso por roles `ADMIN` e `USER`. |
| Exposição de senhas em JSON | Campo protegido com `@JsonIgnore` e `@Schema(accessMode = WRITE_ONLY)`. |
| CSRF | Desabilitado nas APIs REST utilizadas pela SPA separada. |
| CORS | Configurado para permitir apenas a origem autorizada do frontend React. |
| Segurança da sessão | Cookie `JSESSIONID` configurado com `HttpOnly` e `Secure` em produção. |

---