# 🍅 Jornal de Receitas

Sistema web completo para gerenciamento e compartilhamento de receitas culinárias, com design inspirado em jornais clássicos.

🔗 **Acesse online:** [jornal-de-receitas-b6ti.onrender.com](https://jornal-de-receitas-b6ti.onrender.com)

---

## 📋 Sobre o projeto

O **Jornal de Receitas** é uma aplicação web que permite que usuários cadastrem, compartilhem e encontrem receitas culinárias. O sistema conta com dois níveis de acesso (usuário comum e administrador), sistema de aprovação de receitas enviadas, favoritos, filtros de busca, notificações e um painel administrativo completo.

O visual é inspirado em jornais impressos clássicos, com identidade em vinho (`#8b0000`) e dourado (`#d4af37`), tipografia serifada (DM Serif Display, Playfair Display) e cards em estilo brutalist suavizado.

---

## 🏗️ Arquitetura e Padrões de Projeto

O projeto segue o padrão **MVC** com separação em camadas (Controller → Service → DAO → Model) e implementa os seguintes Design Patterns:

### DAO (Data Access Object)
Abstrai o acesso ao banco com interfaces (`IReceitaDAO`, `IUsuarioDAO`, `ICarrosselDAO`, `IFavoritoDAO`, `INotificacaoDAO`, `IEstatisticasDAO`, `ISiteConfigDAO`) e implementações específicas (`ReceitaDAOImpl`, `UsuarioDAOImpl`, etc). Os Services dependem apenas das interfaces, permitindo trocar a tecnologia de persistência sem alterar a lógica de negócio.

### MVC (Model-View-Controller)
- **Model:** entidades JPA (`Receita`, `Usuario`, `Favorito`, `Notificacao`, `Estatisticas`, `CarrosselItem`, `SiteConfig`)
- **View:** templates Thymeleaf
- **Controller:** recebe requisições, delega aos Services e retorna views

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

📐 **Diagramas completos:** [`/Diagramas`](./Diagramas)

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

### 🔍 Busca e filtros
- Filtro por nome, categoria e porções na tela inicial
- Busca paginada com debounce nas telas administrativas

### 🔔 Notificações
- Notificações de novas receitas enviadas
- Notificações de receitas aprovadas e rejeitadas
- Notificações ao favoritar e desfavoritar receitas
- Notificações de receitas excluídas
- Contador de notificações não lidas
- Marcação individual ou de todas as notificações como lidas

### 🎠 Carrossel
- Gerenciamento completo pelo admin (adicionar, editar, ativar/desativar, excluir)
- Suporte a URL de imagem ou upload de arquivo
- Atualização automática via polling

### 👑 Painel administrativo
- **Dashboard:** cards com totais (usuários, receitas por status, favoritos) e gráficos (status de receitas, top 5 mais favoritadas)
- **Usuários:** listagem paginada, busca, edição, exclusão e ativação/desativação
- **Receitas pendentes:** listagem paginada, busca, visualização em modal, edição, aprovação e rejeição
- **Receitas aprovadas:** listagem paginada, busca, visualização em modal, edição e exclusão
- **Receitas rejeitadas:** listagem paginada, busca, visualização em modal e consulta do motivo da rejeição
- **Carrossel:** gerenciamento dos itens exibidos na home
- **Edição de perfil do próprio admin**

### 🎨 Interface
- Design responsivo (mobile, tablet e desktop)
- Cabeçalho fixo com animação de digitação no título (desktop)
- Sidebar mobile com overlay e blur
- Carrossel de receitas em destaque
- Modais elegantes e acessíveis
- Notificações de feedback visual
- Tabs para organização das receitas
- Preview de imagens antes do envio
- Validação dos campos obrigatórios dos formulários
- Loader global de página e spinner em botões de ação

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
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="24"> | HTML5 | — |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="24"> | CSS3 | — |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="24"> | JavaScript | ES6+ |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/thymeleaf/thymeleaf-original.svg" width="24"> | Thymeleaf | 3.0 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fontawesome/fontawesome-original.svg" width="24"> | Font Awesome | 6.4 |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg" width="24"> | Chart.js | 4.x |

### Ferramentas e Infraestrutura

| | Tecnologia |
|---|---|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="24"> | Docker |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="24"> | GitHub |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg" width="24"> | DigitalOcean |

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
- `usuario` 1:n `receita`
- `usuario` 1:n `favorito`
- `usuario` 1:n `notificacao`
- `receita` 1:n `favorito`

**Tabelas sem relacionamento direto:**
- `carrossel` — gerenciado exclusivamente pelo admin, sem vínculo com usuário
- `site_config` — configurações globais do site, sem vínculo com usuário

---

## 📐 Diagramas

### Diagramas de Classe
- **Modelo de Domínio** — entidades, enums e relacionamentos
- **Camada de Negócio e Persistência** — services, DAOs e interfaces
- **Padrões de Projeto** — Command, Factory Method e Builder

📁 Em [`/Diagramas/Diagrama de Classe`](./Diagramas/Diagrama%20de%20Classe)

### Diagramas de Sequência
Total de **21 diagramas**, organizados por domínio:

- **Carrossel (4):** Adicionar, Editar, Alternar, Excluir
- **Login/Cadastro (3):** Cadastro, Login, Logout
- **Notificações (3):** Excluir todas, Marcar como lida, Marcar todas como lidas
- **Receita (8):** Criar, Editar (pendente/aprovada), Excluir, Aprovar, Rejeitar, Favoritar
- **Usuário (3):** Ativar/Desativar, Editar Perfil, Excluir

📁 Em [`/Diagramas/Diagramas de Sequência`](./Diagramas/Diagramas%20de%20Sequência)

---

## 🔌 Documentação da API (Swagger)

A API REST está documentada com **SpringDoc OpenAPI**.

**Acesso online:** [`/swagger-ui/index.html`](https://jornal-de-receitas-b6ti.onrender.com/swagger-ui/index.html)
**Acesso local:** [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)

Endpoints documentados:
- **Autenticação** — cadastro, login, logout, edição de perfil
- **Receitas** — salvar, aprovar, rejeitar, excluir
- **Carrossel** — adicionar, editar, alternar, excluir
- **Favoritos** — adicionar, remover, listar
- **Notificações** — listar, marcar como lida, excluir

---

## 🔒 Segurança

Vulnerabilidades neutralizadas:

| Vulnerabilidade | Como foi neutralizada |
|---|---|
| **SQL Injection** | JPA/Hibernate com queries parametrizadas |
| **XSS** | Escape automático do Thymeleaf |
| **Senhas em texto puro** | BCrypt (`BCryptPasswordEncoder`) |
| **Path Traversal** | Upload com UUID + extensão validada por regex |
| **Autenticação / Autorização** | Spring Security com roles `ADMIN` e `USER` |
| **Exposição de senha em JSON** | Campo anotado com `@JsonIgnore` |
| **CSRF** | Desabilitado com justificativa (API baseada em fetch/JSON) |

---
