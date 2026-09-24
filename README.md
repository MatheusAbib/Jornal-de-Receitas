@'
# 🍅 Jornal de Receitas

Sistema web completo para gerenciamento e compartilhamento de receitas culinárias, com design inspirado em jornais clássicos.

🔗 **Acesse online:** [jornal-de-receitas-b6ti.onrender.com](https://jornal-de-receitas-b6ti.onrender.com)

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

### SOLID
- **S:** cada classe tem uma responsabilidade única (Controllers, Services, DAOs, Commands)
- **O:** novos Comandos e Factories são adicionados sem alterar código existente
- **L:** as implementações de DAO substituem suas interfaces sem quebrar contratos
- **I:** interfaces específicas por entidade
- **D:** Services e Controllers dependem de abstrações (interfaces DAO)

---

## ✨ Funcionalidades

### 👤 Autenticação e usuários
- Cadastro de novos usuários
- Login e logout seguro
- Edição de perfil (nome, e-mail, telefone, gênero, senha)
- Dois níveis de acesso: `USER` e `ADMIN`
- Ativação/desativação de contas pelo administrador

### 📖 Receitas
- Envio de receitas com título, tempo, porções, chefe, categoria (Salgado/Doce), ingredientes, modo de preparo e imagem
- Sistema de aprovação: receitas enviadas ficam pendentes até aprovação do admin
- Listagem de receitas aprovadas separadas por categoria (Salgados / Doces)
- Visualização detalhada com checklist interativo de ingredientes e passos numerados
- Favoritar / desfavoritar receitas
- Aba dedicada a receitas favoritas
- Exclusão de receitas pelo próprio usuário

### ❤️ Favoritos
- Adicionar e remover receitas dos favoritos
- Aba dedicada com todas as receitas favoritadas
- **Modal de resumo dos favoritos** com total de favoritos, ingredientes disponíveis e ingredientes que se repetem entre as receitas
- **Busca dinâmica por ingrediente**: select que consulta em tempo real quantas receitas favoritas contêm aquele ingrediente e lista os títulos correspondentes

### 🔍 Busca e filtros
- Filtro por nome, categoria e porções na tela inicial
- Busca paginada nas telas administrativas

### 🔔 Notificações em tempo real
- Notificações de novas receitas enviadas
- Notificações de receitas aprovadas e rejeitadas
- Notificações ao favoritar e desfavoritar receitas
- Notificações de receitas excluídas
- Contador de notificações não lidas no cabeçalho
- Marcação individual ou de todas as notificações como lidas
- Toasts (feedback visual) para cada ação realizada
- **Polling a cada 10 segundos** — notificações e dados atualizam automaticamente sem necessidade de refresh

### 🎠 Carrossel
- Gerenciamento completo pelo admin (adicionar, editar, ativar/desativar, excluir)
- Suporte a URL de imagem ou upload de arquivo
- Atualização automática via polling

### 👑 Painel administrativo
- **Dashboard:** cards com totais (usuários, receitas por status, favoritos) e gráficos (status de receitas, top 5 mais favoritadas)
- **Usuários:** listagem paginada, busca, edição, exclusão e ativação/desativação
- **Receitas pendentes:** listagem, busca, visualização em modal, edição, aprovação e rejeição
- **Receitas aprovadas:** listagem, busca, visualização em modal, edição e exclusão
- **Receitas rejeitadas:** listagem, busca, visualização em modal e consulta do motivo da rejeição
- **Carrossel:** gerenciamento dos itens exibidos na home
- **Edição de perfil do próprio admin**
- Sidebar responsiva com overlay no mobile

### 🎨 Interface
- Design responsivo (mobile, tablet e desktop) com breakpoints dedicados
- Cabeçalho fixo com estado "scrolled" (encolhe ao rolar, exceto em telas específicas)
- Sidebar mobile com overlay e blur
- Carrossel de receitas em destaque
- Modais elegantes e acessíveis (componente `<Modal>` genérico reutilizável)
- Toasts profissionais via PrimeReact Toast
- Tabs para organização das receitas
- Preview de imagens antes do envio
- Validação dos campos obrigatórios dos formulários
- Loader global de página e spinner em botões de ação
- Loader inline (3 anéis girando) para conteúdo de modais
- Checklist interativo nos ingredientes (risca o item ao marcar)
- Lazy loading de imagens com fallback "Imagem indisponível"
- Scrollbar customizada fina e moderna

---

## 🛠️ Tecnologias

### Backend

| | Tecnologia | Versão |
|---|---|---|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" width="24"> | Java | 21 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" width="24"> | Spring Boot | 3.5.5 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" width="24"> | Spring Security | 6.x |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hibernate/hibernate-original.svg" width="24"> | Hibernate | 6.6 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" width="24"> | MySQL | 8.0 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg" width="24"> | Maven | 3.8+ |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" width="24"> | SpringDoc OpenAPI | 2.x |

### Frontend

| | Tecnologia | Versão |
|---|---|---|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="24"> | React | 19 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" width="24"> | Vite | 8 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/reactrouter/reactrouter-original.svg" width="24"> | React Router | 7 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/axios/axios-plain.svg" width="24"> | Axios | 1.20 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prime/prime-original.svg" width="24"> | PrimeReact | 10 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prime/prime-original.svg" width="24"> | PrimeIcons | 7 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fontawesome/fontawesome-original.svg" width="24"> | Font Awesome | 6.5 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg" width="24"> | Chart.js (via PrimeReact) | 4.x |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="24"> | HTML5 | — |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="24"> | CSS3 | — |

### Ferramentas e Infraestrutura

| | Tecnologia |
|---|---|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="24"> | Docker |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="24"> | GitHub |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg" width="24"> | DigitalOcean / Render |

---

## 🗄️ Banco de dados

| Tabela | Descrição |
|---|---|
| `usuario` | Usuários cadastrados (nome, email, cpf, senha, role, ativo) |
| `receita` | Receitas enviadas (título, ingredientes, modo preparo, imagem, categoria, status) |
| `favorito` | Relação usuário × receita favoritada |
| `notificacao` | Notificações vinculadas aos usuários |
| `estatisticas` | Estatísticas por usuário (receitas, favoritos, notificações) |
| `carrossel` | Itens exibidos no carrossel da home |
| `site_config` | Configurações dinâmicas (favicon, imagens de destaque) |

**Relacionamentos:**
- `usuario` 1:1 `estatisticas`
- `receita` n:1 `usuario`
- `usuario` 1:n `favorito`
- `usuario` 1:n `notificacao`
- `receita` n:1 `favorito`

**Tabelas sem relacionamento direto:**
- `carrossel` — gerenciado exclusivamente pelo admin, sem vínculo com usuário
- `site_config` — configurações globais do site, sem vínculo com usuário

---

## 📐 Diagramas

### Diagramas de Classe
- **Domínio** — entidades, enums, builders e relacionamentos
- **DAOs** — interfaces, implementações e JpaRepositorys
- **Commands** — Command, BaseCommand, comandos concretos e CommandInvoker

📁 Em [`/Diagramas/Diagrama de Classe`](./Diagramas/Diagrama%20de%20Classe)

### Diagramas de Sequência
Total de **30 diagramas**, organizados por domínio, todos fiéis ao código atual (PlantUML):

- **Autenticação (3):** Cadastro, Login, Logout
- **Usuário (5):** Buscar usuário logado, Editar Perfil, Editar Usuário (admin), Ativar/Desativar, Excluir
- **Receita (10):** Criar, Editar, Aprovar, Rejeitar, Excluir, Listar Aprovadas (home), Minhas Receitas, Listar Pendentes (admin), Listar Rejeitadas (admin), Listar Aprovadas (admin)
- **Favorito (3):** Favoritar, Desfavoritar, Listar
- **Notificação (5):** Listar, Listar não lidas, Contador, Marcar como lida, Marcar todas como lidas, Excluir todas
- **Carrossel (6):** Listar público, Listar admin, Adicionar, Editar, Alternar status, Excluir

📁 Em [`/Diagramas/Diagramas de Sequência`](./Diagramas/Diagramas%20de%20Sequência)

---

## 🔌 Documentação da API (Swagger)

A API REST do projeto está totalmente documentada com **SpringDoc OpenAPI** e disponível via **Swagger UI**.

**Acesso online:** [`/swagger-ui/index.html`](https://jornal-de-receitas-b6ti.onrender.com/swagger-ui/index.html)

### O que é Swagger?

**Swagger** é uma interface visual que mostra todos os endpoints REST de uma API. Permite visualizar:
- As rotas disponíveis
- Os parâmetros esperados (com descrição e exemplo)
- Os possíveis retornos (códigos HTTP e exemplos de resposta)
- O schema de cada entidade

Também permite **testar os endpoints direto no navegador**, sem precisar de ferramentas externas.

### O que é SpringDoc OpenAPI?

**SpringDoc** é a biblioteca que lê o código Spring Boot e **gera a documentação OpenAPI automaticamente**. Com o SpringDoc, basta anotar os controllers com `@Tag`, `@Operation`, `@ApiResponses`, `@Parameter` e os models com `@Schema` — e o Swagger exibe tudo com exemplos reais.

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

## 🔒 Segurança

Vulnerabilidades neutralizadas:

| Vulnerabilidade | Como foi neutralizada |
|---|---|
| **SQL Injection** | JPA/Hibernate com queries parametrizadas |
| **Senhas em texto puro** | BCrypt (`BCryptPasswordEncoder`) |
| **Autenticação / Autorização** | Spring Security com roles `ADMIN` e `USER` |
| **Exposição de senha em JSON** | Campo anotado com `@JsonIgnore` e `@Schema(accessMode = WRITE_ONLY)` |
| **CSRF** | Desabilitado apenas para APIs REST (frontend é SPA separado) |
| **CORS** | Configurado para permitir apenas a origem do frontend React |
| **Sessão** | Cookie `JSESSIONID` com `HttpOnly` e `Secure` em produção |

---