-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tempo de Geração: 22/09/2026 às 13h15min
-- Versão do Servidor: 5.5.20
-- Versão do PHP: 5.3.9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Banco de Dados: `receitas`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `carrossel`
--

CREATE TABLE IF NOT EXISTS `carrossel` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text,
  `imagem_url` text NOT NULL,
  `ativo` bit(1) NOT NULL DEFAULT b'1',
  `ordem_exibicao` int(11) DEFAULT NULL,
  `link_destino` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Extraindo dados da tabela `carrossel`
--

INSERT INTO `carrossel` (`id`, `titulo`, `descricao`, `imagem_url`, `ativo`, `ordem_exibicao`, `link_destino`) VALUES
(1, 'Bolo de Chocolate', 'Uma receita incrível para os amantes de chocolate\r\n', 'https://i.ibb.co/r2PkDV5r/bolo-chocolate.png', '1', 1, '/detalhe/103'),
(2, 'Salada Tropical', 'Refrescante e cheia de nutrientes para o verão', 'https://i.ibb.co/HTRg8HhV/salada.png', '1', 2, '/detalhe/104'),
(3, 'Frango Assado', 'Perfeito para um jantar em família', 'https://i.imgur.com/yId1mTM.png', '1', 3, '/detalhe/102');

-- --------------------------------------------------------

--
-- Estrutura da tabela `estatisticas`
--

CREATE TABLE IF NOT EXISTS `estatisticas` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `total_receitas` int(11) NOT NULL DEFAULT '0',
  `receitas_aprovadas` int(11) NOT NULL DEFAULT '0',
  `receitas_rejeitadas` int(11) NOT NULL DEFAULT '0',
  `receitas_pendentes` int(11) NOT NULL DEFAULT '0',
  `total_favoritos` int(11) NOT NULL DEFAULT '0',
  `total_notificacoes` int(11) NOT NULL DEFAULT '0',
  `ultima_atividade` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Extraindo dados da tabela `estatisticas`
--

INSERT INTO `estatisticas` (`id`, `usuario_id`, `total_receitas`, `receitas_aprovadas`, `receitas_rejeitadas`, `receitas_pendentes`, `total_favoritos`, `total_notificacoes`, `ultima_atividade`) VALUES
(1, 10, 0, 0, 0, 0, 0, 0, '2026-09-17 12:17:15'),
(2, 29, 1, 1, 0, 0, 7, 8, '2026-09-21 21:45:24'),
(3, 7, 7, 4, 1, 2, 6, 3, '2026-09-21 23:09:27'),
(4, 28, 0, 0, 0, 0, 0, 0, '2026-09-17 12:17:15'),
(8, 30, 0, 0, 0, 0, 0, 0, '2026-09-17 17:16:47'),
(9, 31, 0, 0, 0, 0, 0, 0, '2026-09-18 19:53:20');

-- --------------------------------------------------------

--
-- Estrutura da tabela `favorito`
--

CREATE TABLE IF NOT EXISTS `favorito` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `receita_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuario_receita` (`usuario_id`,`receita_id`),
  UNIQUE KEY `UK9lira0x20lfaltgsj5bwrbjns` (`usuario_id`,`receita_id`),
  KEY `fk_favorito_receita` (`receita_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=75 ;

--
-- Extraindo dados da tabela `favorito`
--

INSERT INTO `favorito` (`id`, `usuario_id`, `receita_id`) VALUES
(66, 7, 100),
(72, 7, 102),
(68, 7, 118),
(69, 7, 146),
(70, 7, 147),
(71, 7, 156),
(30, 29, 100),
(37, 29, 102),
(33, 29, 104),
(32, 29, 105),
(36, 29, 117),
(34, 29, 118),
(74, 29, 157);

-- --------------------------------------------------------

--
-- Estrutura da tabela `notificacao`
--

CREATE TABLE IF NOT EXISTS `notificacao` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `data_hora` datetime NOT NULL,
  `lida` bit(1) NOT NULL,
  `mensagem` text NOT NULL,
  `tipo` enum('DESFAVORITOU','FAVORITOU','NOVA_RECEITA','RECEITA_APROVADA','RECEITA_EXCLUIDA','RECEITA_REJEITADA') NOT NULL,
  `usuario_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkhtmkl9niu8mcche3x53as5sg` (`usuario_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=157 ;

--
-- Extraindo dados da tabela `notificacao`
--

INSERT INTO `notificacao` (`id`, `data_hora`, `lida`, `mensagem`, `tipo`, `usuario_id`) VALUES
(5, '2026-09-14 21:25:55', '0', 'Nova receita enviada para aprovação: "Coxinha de Frango".', 'NOVA_RECEITA', 10),
(6, '2026-09-14 21:29:25', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(7, '2026-09-14 21:30:56', '0', 'Nova receita enviada para aprovação: "Feijoada Completa".', 'NOVA_RECEITA', 10),
(8, '2026-09-14 21:36:06', '0', 'Nova receita enviada para aprovação: "Espaguete à Carbonara".', 'NOVA_RECEITA', 10),
(11, '2026-09-14 21:37:25', '0', 'Nova receita publicada: "Coxinha de Frango".', 'NOVA_RECEITA', 28),
(15, '2026-09-14 21:37:47', '0', 'Nova receita publicada: "Espaguete à Carbonara".', 'NOVA_RECEITA', 28),
(18, '2026-09-14 21:38:18', '0', 'Nova receita publicada: "Feijoada Completa".', 'NOVA_RECEITA', 28),
(31, '2026-09-15 13:53:25', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(34, '2026-09-15 13:53:56', '0', 'Nova receita publicada: "Bolo de Chocolate".', 'NOVA_RECEITA', 28),
(49, '2026-09-15 14:22:37', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(52, '2026-09-15 14:24:18', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(54, '2026-09-15 14:24:31', '0', 'Nova receita enviada para aprovação: "Feijoada Completa".', 'NOVA_RECEITA', 10),
(58, '2026-09-15 14:27:18', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(61, '2026-09-15 14:27:55', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(64, '2026-09-15 14:29:11', '0', 'Nova receita publicada: "Bolo de Chocolate".', 'NOVA_RECEITA', 28),
(69, '2026-09-15 15:38:48', '0', 'Nova receita enviada para aprovação: "222".', 'NOVA_RECEITA', 10),
(71, '2026-09-15 15:45:14', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(73, '2026-09-15 16:21:44', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(75, '2026-09-15 16:26:09', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(101, '2026-09-17 12:08:16', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(104, '2026-09-17 12:10:42', '0', 'Nova receita publicada: "Bolo de Chocolate".', 'NOVA_RECEITA', 28),
(105, '2026-09-17 12:10:42', '1', 'Nova receita publicada: "Bolo de Chocolate".', 'NOVA_RECEITA', 29),
(107, '2026-09-17 12:31:39', '1', 'Sua receita "Bolo de Chocolate" foi aprovada pelo administrador.', 'RECEITA_APROVADA', 29),
(109, '2026-09-17 12:31:39', '0', 'Nova receita publicada: "Bolo de Chocolate".', 'NOVA_RECEITA', 28),
(111, '2026-09-17 12:32:03', '0', 'Nova receita publicada: "Bolo de Chocolate".', 'NOVA_RECEITA', 28),
(112, '2026-09-17 12:32:03', '1', 'Nova receita publicada: "Bolo de Chocolate".', 'NOVA_RECEITA', 29),
(118, '2026-09-17 12:33:51', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(125, '2026-09-17 12:37:40', '0', 'Nova receita enviada para aprovação: "Coxinha de Frango".', 'NOVA_RECEITA', 10),
(126, '2026-09-17 12:37:40', '1', 'Sua receita "Coxinha de Frango" foi enviada para aprovação.', 'NOVA_RECEITA', 29),
(127, '2026-09-17 12:37:55', '1', 'Sua receita "Coxinha de Frango" foi excluída.', 'RECEITA_EXCLUIDA', 29),
(128, '2026-09-17 12:38:31', '0', 'Nova receita enviada para aprovação: "Bolo de Chocolate".', 'NOVA_RECEITA', 10),
(151, '2026-09-21 17:50:44', '0', 'Você adicionou "Bolo de Chocolate" aos favoritos.', 'FAVORITOU', 7),
(152, '2026-09-21 17:51:16', '0', 'Você adicionou "Frango ao Curry" aos favoritos.', 'FAVORITOU', 7),
(153, '2026-09-21 18:43:11', '0', 'Você adicionou "Bolo de Chocolate" aos favoritos.', 'FAVORITOU', 29),
(154, '2026-09-21 18:45:11', '0', 'Você removeu "Bolo de Chocolate" dos favoritos.', 'DESFAVORITOU', 29),
(155, '2026-09-21 18:45:24', '0', 'Você adicionou "Bolo de Chocolate" aos favoritos.', 'FAVORITOU', 29),
(156, '2026-09-21 20:09:27', '0', 'Sua receita "Bolo de Chocolate" foi excluída.', 'RECEITA_EXCLUIDA', 7);

-- --------------------------------------------------------

--
-- Estrutura da tabela `receita`
--

CREATE TABLE IF NOT EXISTS `receita` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) DEFAULT NULL,
  `ingredientes` text,
  `imagem` text,
  `modo_preparo` text,
  `tempo_preparo` varchar(255) DEFAULT NULL,
  `porcoes` int(11) NOT NULL DEFAULT '1',
  `chefe` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `categoria` varchar(10) DEFAULT 'SALGADO',
  `motivo_rejeicao` text,
  `status` varchar(20) NOT NULL DEFAULT 'PENDENTE',
  PRIMARY KEY (`id`),
  KEY `FK4wm6kmy0pt03iqyfasswhau57` (`usuario_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=161 ;

--
-- Extraindo dados da tabela `receita`
--

INSERT INTO `receita` (`id`, `titulo`, `ingredientes`, `imagem`, `modo_preparo`, `tempo_preparo`, `porcoes`, `chefe`, `usuario_id`, `categoria`, `motivo_rejeicao`, `status`) VALUES
(100, 'Lasanha à Bolonhesa', '2 dentes de alho picados||1 cebola média picada||500g de carne moída||500ml de molho de tomate||300g de massa de lasanha||200g de queijo mussarela fatiado||150g de presunto fatiado||Sal a gosto||Pimenta a gosto||2 colheres de sopa de azeite', 'https://portal.lodivino.com.br/images/receitas/lasanha-a-bolonhesa.jpg', 'Refogue alho e cebola no azeite||Adicione a carne moída e cozinhe até dourar||Acrescente o molho de tomate e tempere com sal e pimenta||Monte a lasanha alternando camadas de massa, molho, presunto e queijo||Finalize com queijo por cima||Leve ao forno pré-aquecido a 180°C por 30 minutos||Sirva quente', '1h 30 Minutos', 6, 'Chef Italiano', NULL, 'SALGADO', NULL, 'APROVADA'),
(102, 'Frango ao Curry', '500g de peito de frango cortado em cubos||1 cebola picada||2 dentes de alho picados||200ml de leite de coco||2 colheres de sopa de curry em pó||Sal a gosto||Pimenta a gosto||2 colheres de sopa de azeite||Coentro fresco a gosto', 'https://th.bing.com/th/id/R.95226a4a0964cacb1eaf481c252bbb88?rik=3ay8e79scOnaFQ&pid=ImgRaw&r=0', 'Refogue cebola e alho no azeite||Adicione o frango cortado em cubos e cozinhe até dourar||Polvilhe curry e misture bem||Acrescente leite de coco e cozinhe por 15 minutos||Tempere com sal e pimenta||Finalize com coentro fresco picado||Sirva com arroz branco', '40 Minutos', 4, 'Chef Indiano', NULL, 'SALGADO', NULL, 'APROVADA'),
(103, 'Bolo de Chocolate', '200g de farinha de trigo||200g de açúcar||50g de cacau em pó||10g de fermento em pó||3 ovos||150ml de leite||100g de manteiga||100g de chocolate meio amargo||1 colher de chá de essência de baunilha||1 pitada de sal', 'https://receitadaboa.com.br/wp-content/uploads/2024/12/bolo-de-chocolate.jpg', 'Misture farinha, cacau, fermento e sal||Bata ovos, açúcar e manteiga até formar creme||Acrescente leite e baunilha||Misture os secos aos poucos||Coloque massa em forma untada||Leve ao forno pré-aquecido a 180°C por 35 minutos||Deixe esfriar antes de desenformar||Derreta chocolate e cubra o bolo', '1h 10 Minutos', 5, 'Chef Confeiteiro', NULL, 'DOCE', NULL, 'APROVADA'),
(104, 'Salada Caprese', '2 tomates grandes||200g de mussarela de búfala||Folhas de manjericão fresco a gosto||2 colheres de sopa de azeite||Sal a gosto||Pimenta a gosto||1 colher de sopa de vinagre balsâmico', 'https://3.bp.blogspot.com/-TVfFjf-qqsY/W1DUWGqKByI/AAAAAAAAKfw/Z_RcOZF-w-oXbyzyYMKUpm1E1IlG8FNQQCLcBGAs/s1600/468.jpg', 'Corte tomates e mussarela em fatias||Intercale fatias em prato||Adicione folhas de manjericão||Tempere com sal, pimenta e azeite||Regue com vinagre balsâmico||Sirva fresca', '15 Minutos', 2, 'Chef Italiano', NULL, 'SALGADO', NULL, 'APROVADA'),
(105, 'Espaguete à Carbonara', '250g de espaguete||150g de bacon em cubos||2 ovos||50g de queijo parmesão ralado||2 dentes de alho picados||Sal a gosto||Pimenta do reino a gosto||1 colher de sopa de azeite', 'https://th.bing.com/th/id/R.c57f8defd551e7aa59032e8835c3ca1d?rik=acCqxCTmH1SfhA&pid=ImgRaw&r=0', 'Cozinhe espaguete conforme instruções da embalagem||Frite bacon com alho no azeite||Bata ovos com parmesão||Misture espaguete ainda quente com bacon||Retire do fogo e adicione mistura de ovos e queijo||Tempere com sal e pimenta||Sirva imediatamente', '30 Minutos', 6, 'Chef Italiano', NULL, 'SALGADO', NULL, 'APROVADA'),
(106, 'Panquecas Americanas', '1 xícara de farinha||1 ovo||1 xícara de leite||1 colher de sopa de açúcar||1 colher de chá de fermento em pó||1 pitada de sal||Manteiga para untar', 'https://moinhoglobo.com.br/wp-content/uploads/2015/10/panqueca-americana-1-768x447.jpg', 'Misture a farinha, açúcar, fermento e sal||Adicione o ovo e o leite e misture até formar uma massa homogênea||Aqueça uma frigideira antiaderente e unte com manteiga||Despeje pequenas porções da massa na frigideira||Cozinhe cada lado até dourar||Repita até terminar a massa||Sirva com mel, manteiga ou frutas', '20 Minutos', 4, 'Chef Americano', NULL, 'DOCE', NULL, 'APROVADA'),
(117, 'Risoto de Cogumelos', '1 xícara de arroz arbóreo||300g de cogumelos variados (shimeji, shiitake, champignon)||1 cebola picada||2 dentes de alho picados||1 litro de caldo de legumes||100ml de vinho branco seco||100g de queijo parmesão ralado||2 colheres de sopa de manteiga||Sal a gosto||Pimenta do reino a gosto||Salsinha picada a gosto', 'https://www.comidaereceitas.com.br/wp-content/uploads/2008/07/Risoto-de-cogumelo-paris-e-menta-freepik.jpg', 'Refogue cebola e alho em manteiga até dourarem||Adicione os cogumelos limpos e frite por 5 minutos||Acrescente o arroz arbóreo e refogue por 2 minutos||Regue com vinho branco e espere evaporar||Adicione caldo de legumes quente aos poucos, mexendo sempre||Quando o arroz estiver al dente, retire do fogo||Misture o parmesão ralado||Tempere com sal e pimenta||Finalize com salsinha picada||Sirva imediatamente', '40 Minutos', 4, 'Chef Vegetariano', NULL, 'SALGADO', NULL, 'APROVADA'),
(118, 'Moqueca de Peixe', '1kg de filé de peixe (pescada, robalo ou badejo)||2 cebolas médias cortadas em rodelas||2 tomates cortados em rodelas||1 pimentão verde cortado em rodelas||1 pimentão vermelho cortado em rodelas||200ml de leite de coco||Suco de 1 limão||2 colheres de sopa de azeite de dendê||2 colheres de sopa de azeite de oliva||Coentro a gosto||Sal a gosto||Pimenta-do-reino a gosto', 'https://img.taste.com.au/bGVvI3El/taste/2016/11/moqueca-de-peixe-57539-1.jpeg', 'Tempere os filés de peixe com suco de limão, sal e pimenta||Em uma panela de barro, aqueça os azeites||Disponha camadas de cebola, tomate e pimentões||Coloque os filés de peixe por cima das verduras||Adicione o leite de coco||Tampe a panela e cozinhe em fogo baixo por 20 minutos||Mexa delicadamente uma vez durante o cozimento||Finalize com coentro picado||Sirva com arroz branco e pirão', '50 Minutos', 6, 'Chef Brasileiro', NULL, 'SALGADO', NULL, 'APROVADA'),
(119, 'Pudim de Leite Condensado', '1 lata de leite condensado||2 latas de leite (medida da lata de leite condensado)||3 ovos||1 xícara de açúcar para caramelizar||1 colher de chá de essência de baunilha', 'https://receitasdebemcasado.com/wp-content/uploads/2025/01/Pudim-de-leite-condensado-1060x836.png', 'Caramelize o açúcar em fogo baixo até obter uma cor dourada||Coloque o caramelo em uma forma de pudim e espalhe bem||No liquidificador, bata o leite condensado, leite, ovos e baunilha||Despeje a mistura na forma caramelizada||Cubra com papel alumínio||Leve ao forno em banho-maria por aproximadamente 1 hora||Faça o teste do palito para verificar se está cozido||Deixe esfriar completamente e leve à geladeira por no mínimo 4 horas||Desenforme cuidadosamente e sirva gelado', '1h 30 Minutos', 8, 'Chef Confeiteiro', NULL, 'DOCE', NULL, 'APROVADA'),
(146, 'Espaguete à Carbonara', '1 g de Ssss', '1789421766007_71mFm0rJiML._SY466_.jpg', 'Sssss', '40 minutos', 1, 'Lucia Silva Meneguel', 7, 'SALGADO', NULL, 'APROVADA'),
(147, 'Bolo de Chocolate', '1 g de Sss', '1789480405503_image (10).jpg', 'Sss', '1h 10 minutos', 1, 'Lucia Silva Meneguel', 7, 'SALGADO', NULL, 'APROVADA'),
(152, 'Bolo de Chocolate', '1 g de Sss', '1789482475766_image (10).jpg', 'Ssss', '22 minutos', 1, 'Lucia Silva Meneguel', 7, 'SALGADO', NULL, 'APROVADA'),
(155, 'Bolo de Chocolate', '1 g de Sss', '1789489304523_Dom-Casmurro-Capa-da-obra-1899.webp', 'Ssss', '33min', 1, 'Lucia Silva Meneguel', 7, 'SALGADO', 'ssss', 'REJEITADA'),
(156, 'Bolo de Chocolate', '1 g de Dddd', '1789489569365_71CaTj9MAFL._SY466_.jpg', 'Ddd', '22min', 1, 'Matheus Bilitardo Abib', 29, 'SALGADO', NULL, 'APROVADA'),
(157, 'Bolo de Chocolate', '1 g de Sssss||1 g de Sssss', '0078c9fa-69ec-4175-9acc-ca5b24add738.jpg', 'Ssssss', '30min', 1, 'Lucia Silva Meneguel', 7, 'DOCE', NULL, 'APROVADA'),
(158, 'Bolo de Chocolate', '1 g de Ggg', '48210695-4b68-487a-8299-79afb36e362f.jpg', 'Gggg', '6min', 1, 'Lucia Silva Meneguel', 7, 'SALGADO', NULL, 'PENDENTE'),
(160, 'Bolo de Chocolate', '1 g de Cccc', '0d530f07-1ec8-4404-965d-2945a8ed4940.jpg', 'Ccccc', '55min', 1, 'Lucia Silva Meneguel', 7, 'SALGADO', NULL, 'PENDENTE');

-- --------------------------------------------------------

--
-- Estrutura da tabela `site_config`
--

CREATE TABLE IF NOT EXISTS `site_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chave` varchar(255) NOT NULL,
  `valor` text,
  `descricao` varchar(255) DEFAULT NULL,
  `ativo` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_chave` (`chave`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Extraindo dados da tabela `site_config`
--

INSERT INTO `site_config` (`id`, `chave`, `valor`, `descricao`, `ativo`) VALUES
(3, 'favicon_url', 'https://cdn-icons-png.flaticon.com/512/7761/7761545.png', 'URL do favicon do site', '1'),
(4, 'ganache_url', 'https://www.maxionline.ec/wp-content/uploads/2018/10/ganache.jpg', 'URL da imagem do Ganache', '1'),
(5, 'sopa_url', 'https://claudia.abril.com.br/wp-content/uploads/2020/02/sopa-detox-abobora.jpg', 'URL da imagem da Sopa de Abóbora', '1'),
(6, 'pesto_url', 'https://www.comidaereceitas.com.br/wp-content/uploads/2011/08/Espaguete-ao-molho-pesto-vegan-freepik.jpg', 'URL da imagem do Espaguete ao Pesto', '1'),
(7, 'bolinho_url', 'https://moinhoglobo.com.br/wp-content/uploads/2020/01/11-bolinho-de-chuva.jpg', 'URL da imagem dos Bolinhos de Chuva', '1');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cpf` varchar(14) NOT NULL,
  `data_cadastro` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `genero` varchar(255) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `ativo` bit(1) NOT NULL,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK692bsnqxa8m9fmx7m1yc6hsui` (`cpf`),
  UNIQUE KEY `UK5171l57faosmj8myawaucatdw` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`id`, `cpf`, `data_cadastro`, `email`, `genero`, `nome`, `senha`, `telefone`, `ativo`, `role`) VALUES
(7, '51397022078', '2025-09-09', 'luciasilva@gmail.com', 'FEMININO', 'Lucia Silva Meneguel', '$2a$10$kkB3I1z/Wf.HR3bRTD2ueeHSpAeeI36Yqdrznz5570RVu.1KjBgMa', '11975072008', '1', 'USER'),
(10, '000.000.000-00', '2025-09-29', 'admin@jornal.com', 'MASCULINO', 'ADMIN', '$2a$10$y6Lm5K69PraYQQZopHitgen0BgcX8W18HIC6FtdKAWSOKiqVgqXJu', '0000000000', '1', 'ADMIN'),
(28, '777.777.777-77', '2026-06-10', 'luciasilvaaa@gmail.com', 'Masculino', 'Lucia  Meneguel', '$2a$10$SpMdgCt1SD.QuzNcLIP7g.AP/2DpObpR5XEzd54GYgLhtgARYgaG6', '(11) 9750-72008', '1', 'USER'),
(29, '42211384838', '2026-09-14', 'matheus.abib.ma@gmail.com', 'MASCULINO', 'Matheus Bilitardo Abib', '$2a$10$aAWt3hKdySBmLoOuxSCHQ.k1OdIpx1a3x1zxMz5NMdGQh4l6bkmpC', '11975072008', '1', 'USER'),
(30, '23232323232', '2026-09-17', 'renata@gmail.com', 'FEMININO', 'Renata Almeida Pires', '$2a$10$WbD/o0cPo8MFHqZKwvQYxuZwcs2UGhWPKcLYsknBvIjq9BswRN7Ae', '12332232323', '0', 'USER'),
(31, '86030369008', '2026-09-18', 'matheus.abib.maaaaa@gmail.com', NULL, 'Matheus Bilitardo Abib', '$2a$10$.kprxEaiyBvx9TbZU6QD3eZC2JkYrNZBkTgbWWKnyd/8lgFzbjFu6', NULL, '1', 'USER');

--
-- Restrições para as tabelas dumpadas
--

--
-- Restrições para a tabela `estatisticas`
--
ALTER TABLE `estatisticas`
  ADD CONSTRAINT `estatisticas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Restrições para a tabela `favorito`
--
ALTER TABLE `favorito`
  ADD CONSTRAINT `fk_favorito_receita` FOREIGN KEY (`receita_id`) REFERENCES `receita` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favorito_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Restrições para a tabela `notificacao`
--
ALTER TABLE `notificacao`
  ADD CONSTRAINT `FKkhtmkl9niu8mcche3x53as5sg` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Restrições para a tabela `receita`
--
ALTER TABLE `receita`
  ADD CONSTRAINT `FK4wm6kmy0pt03iqyfasswhau57` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
