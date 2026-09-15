# 🍅 Jornal de Receitas

Sistema web completo para gerenciamento e compartilhamento de receitas culinárias, com design inspirado em jornais clássicos.

🔗 **Acesse online:** [jornal-de-receitas-b6ti.onrender.com](https://jornal-de-receitas-b6ti.onrender.com)

---

## 📋 Sobre o projeto

O **Jornal de Receitas** é uma aplicação web que permite que usuários cadastrem, compartilhem e encontrem receitas culinárias. O sistema conta com dois níveis de acesso (usuário comum e administrador), sistema de aprovação de receitas enviadas, favoritos, filtros de busca, notificações e um painel administrativo completo.

O visual é inspirado em jornais impressos clássicos, com identidade em vinho (`#8b0000`) e dourado (`#d4af37`), tipografia serifada (DM Serif Display, Playfair Display) e cards em estilo brutalist suavizado.

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

### 👑 Painel administrativo
- **Usuários:** listagem paginada, busca, edição, exclusão e ativação/desativação
- **Receitas pendentes:** listagem paginada, busca, visualização em modal, edição, aprovação e rejeição
- **Receitas aprovadas:** listagem paginada, busca, visualização em modal, edição e exclusão
- **Receitas rejeitadas:** listagem paginada, busca, visualização em modal e consulta do motivo da rejeição
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
- Loader global de página

---

## 🛠️ Tecnologias

### Backend

| Tecnologia | Versão |
|---|---|
| Java | 21 |
| Spring Boot | 3.5.5 |
| Spring Security | 6.x |
| Spring Data JPA | 3.x |
| Hibernate | 6.6 |
| MySQL | 5.5.20 |
| Maven | 3.8+ |

### Frontend

| Tecnologia | Versão |
|---|---|
| HTML5 | — |
| CSS3 | — |
| JavaScript | ES6+ |
| Thymeleaf | 3.0 |
| Font Awesome | 6.4 |

---

## 🗄️ Banco de dados

Tabelas principais:

| Tabela | Descrição |
|---|---|
| `usuario` | Usuários cadastrados (nome, email, cpf, senha, role, ativo) |
| `receita` | Receitas enviadas (título, ingredientes, modo preparo, imagem, categoria, status) |
| `favorito` | Relação usuário × receita favoritada |
| `notificacao` | Notificações vinculadas aos usuários |
| `carrossel` | Itens exibidos no carrossel da home |
| `site_config` | Configurações dinâmicas (favicon, imagens de destaque) |

---
