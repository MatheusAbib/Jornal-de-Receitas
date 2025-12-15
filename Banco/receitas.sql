-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tempo de Geração: 15/12/2025 às 12h09min
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Extraindo dados da tabela `carrossel`
--

INSERT INTO `carrossel` (`id`, `titulo`, `descricao`, `imagem_url`, `ativo`, `ordem_exibicao`, `link_destino`) VALUES
(1, 'Bolo de Chocolate', 'Uma receita incrível para os amantes de chocolate', 'https://i.ibb.co/r2PkDV5r/bolo-chocolate.png', '1', 1, '/detalhe/103'),
(2, 'Salada Tropical', 'Refrescante e cheia de nutrientes para o verão', 'https://i.ibb.co/HTRg8HhV/salada.png', '1', 2, '/detalhe/104'),
(3, 'Frango Assado', 'Perfeito para um jantar em família', 'https://i.imgur.com/yId1mTM.png', '1', 3, '/detalhe/102');

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
  `aprovada` tinyint(1) NOT NULL DEFAULT '0',
  `porcoes` int(11) NOT NULL DEFAULT '1',
  `chefe` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4wm6kmy0pt03iqyfasswhau57` (`usuario_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=107 ;

--
-- Extraindo dados da tabela `receita`
--

INSERT INTO `receita` (`id`, `titulo`, `ingredientes`, `imagem`, `modo_preparo`, `tempo_preparo`, `aprovada`, `porcoes`, `chefe`, `usuario_id`) VALUES
(100, 'Lasanha à Bolonhesa', '2 dentes de alho picados||1 cebola média picada||500g de carne moída||500ml de molho de tomate||300g de massa de lasanha||200g de queijo mussarela fatiado||150g de presunto fatiado||Sal a gosto||Pimenta a gosto||2 colheres de sopa de azeite', 'https://portal.lodivino.com.br/images/receitas/lasanha-a-bolonhesa.jpg', 'Refogue alho e cebola no azeite||Adicione a carne moída e cozinhe até dourar||Acrescente o molho de tomate e tempere com sal e pimenta||Monte a lasanha alternando camadas de massa, molho, presunto e queijo||Finalize com queijo por cima||Leve ao forno pré-aquecido a 180°C por 30 minutos||Sirva quente', '1h 30', 1, 6, NULL, NULL),
(102, 'Frango ao Curry', '500g de peito de frango cortado em cubos||1 cebola picada||2 dentes de alho picados||200ml de leite de coco||2 colheres de sopa de curry em pó||Sal a gosto||Pimenta a gosto||2 colheres de sopa de azeite||Coentro fresco a gosto', 'https://tse2.mm.bing.net/th/id/OIP.yZHPNYhVuwT4MWAcvXZPbgHaER?rs=1&pid=ImgDetMain&o=7&rm=3', 'Refogue cebola e alho no azeite||Adicione o frango cortado em cubos e cozinhe até dourar||Polvilhe curry e misture bem||Acrescente leite de coco e cozinhe por 15 minutos||Tempere com sal e pimenta||Finalize com coentro fresco picado||Sirva com arroz branco', '40', 1, 4, NULL, NULL),
(103, 'Bolo de Chocolate', '200g de farinha de trigo||200g de açúcar||50g de cacau em pó||10g de fermento em pó||3 ovos||150ml de leite||100g de manteiga||100g de chocolate meio amargo||1 colher de chá de essência de baunilha||1 pitada de sal', 'https://img.cybercook.com.br/imagens/receitas/969/bolo-de-chocolate-molhadinho-11.jpeg', 'Misture farinha, cacau, fermento e sal||Bata ovos, açúcar e manteiga até formar creme||Acrescente leite e baunilha||Misture os secos aos poucos||Coloque massa em forma untada||Leve ao forno pré-aquecido a 180°C por 35 minutos||Deixe esfriar antes de desenformar||Derreta chocolate e cubra o bolo', '1h 10', 1, 8, NULL, NULL),
(104, 'Salada Caprese', '2 tomates grandes||200g de mussarela de búfala||Folhas de manjericão fresco a gosto||2 colheres de sopa de azeite||Sal a gosto||Pimenta a gosto||1 colher de sopa de vinagre balsâmico', 'https://3.bp.blogspot.com/-TVfFjf-qqsY/W1DUWGqKByI/AAAAAAAAKfw/Z_RcOZF-w-oXbyzyYMKUpm1E1IlG8FNQQCLcBGAs/s1600/468.jpg', 'Corte tomates e mussarela em fatias||Intercale fatias em prato||Adicione folhas de manjericão||Tempere com sal, pimenta e azeite||Regue com vinagre balsâmico||Sirva fresca', '15', 1, 2, NULL, NULL),
(105, 'Espaguete à Carbonara', '250g de espaguete||150g de bacon em cubos||2 ovos||50g de queijo parmesão ralado||2 dentes de alho picados||Sal a gosto||Pimenta do reino a gosto||1 colher de sopa de azeite', 'https://th.bing.com/th/id/R.c57f8defd551e7aa59032e8835c3ca1d?rik=acCqxCTmH1SfhA&pid=ImgRaw&r=0', 'Cozinhe espaguete conforme instruções da embalagem||Frite bacon com alho no azeite||Bata ovos com parmesão||Misture espaguete ainda quente com bacon||Retire do fogo e adicione mistura de ovos e queijo||Tempere com sal e pimenta||Sirva imediatamente', '30', 1, 4, NULL, NULL),
(106, 'Panquecas Americanas', '1 xícara de farinha||1 ovo||1 xícara de leite||1 colher de sopa de açúcar||1 colher de chá de fermento em pó||1 pitada de sal||Manteiga para untar', 'https://i2.wp.com/abglt.org.br/wp-content/uploads/2021/10/panquecas-americanas.jpg?fit=1361%2C766&ssl=1', 'Misture a farinha, açúcar, fermento e sal||Adicione o ovo e o leite e misture até formar uma massa homogênea||Aqueça uma frigideira antiaderente e unte com manteiga||Despeje pequenas porções da massa na frigideira||Cozinhe cada lado até dourar||Repita até terminar a massa||Sirva com mel, manteiga ou frutas', '20', 1, 4, NULL, NULL);

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`id`, `cpf`, `data_cadastro`, `email`, `genero`, `nome`, `senha`, `telefone`, `ativo`, `role`) VALUES
(7, '51397022078', '2025-09-09', 'luciasilva@gmail.com', NULL, 'Lucia Silva', '$2a$10$kkB3I1z/Wf.HR3bRTD2ueeHSpAeeI36Yqdrznz5570RVu.1KjBgMa', '11975072008', '1', 'USER'),
(10, '000.000.000-00', '2025-09-29', 'admin@jornal.com', 'MASCULINO', 'ADMIN', '$2a$10$y6Lm5K69PraYQQZopHitgen0BgcX8W18HIC6FtdKAWSOKiqVgqXJu', '0000000000', '1', 'ADMIN'),
(19, '45365316029', '2025-11-28', 'matheus.abibb@gmail.com', 'Masculino', 'Matheus Abib', '$2a$10$ZqEgdA58cDmc6eOtX.fWteL2J5ns7383paYqd8kl6T69wcPclN5sO', '11111111111', '1', 'USER');

--
-- Restrições para as tabelas dumpadas
--

--
-- Restrições para a tabela `receita`
--
ALTER TABLE `receita`
  ADD CONSTRAINT `FK4wm6kmy0pt03iqyfasswhau57` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
