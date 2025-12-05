-- Script para popular a tabela carrossel com dados iniciais

-- Primeiro, crie a tabela se ainda não existir
CREATE TABLE IF NOT EXISTS `carrossel` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text,
  `imagem_url` text NOT NULL,
  `ativo` bit(1) NOT NULL DEFAULT b'1',
  `ordem_exibicao` int(11) DEFAULT NULL,
  `link_destino` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Limpar dados existentes (opcional)
-- DELETE FROM `carrossel`;

-- Inserir dados iniciais para o carrossel
INSERT INTO `carrossel` (`titulo`, `descricao`, `imagem_url`, `ativo`, `ordem_exibicao`, `link_destino`) VALUES
('Bolo de Chocolate', 'Uma receita incrível para os amantes de chocolate', '/uploads/bolo-chocolate.jpg', 1, 1, '/detalhe/103'),
('Salada Tropical', 'Refrescante e cheia de nutrientes para o verão', '/uploads/salada.jpg', 1, 2, '/detalhe/104'),
('Frango Assado', 'Perfeito para um jantar em família', '/uploads/frango.jpg', 1, 3, '/detalhe/102'),
('Lasanha à Bolonhesa', 'Clássico italiano que conquista a todos', '/uploads/bolo-chocolate.jpg', 1, 4, '/detalhe/100'),
('Espaguete à Carbonara', 'Massa cremosa com bacon e queijo parmesão', '/uploads/bolinho-chuva.jpg', 1, 5, '/detalhe/105');

-- Para mais imagens, você pode usar URLs da internet ou adicionar mais imagens na pasta uploads
INSERT INTO `carrossel` (`titulo`, `descricao`, `imagem_url`, `ativo`, `ordem_exibicao`, `link_destino`) VALUES
('Panquecas Americanas', 'Fofinhas e deliciosas para o café da manhã', 'https://i2.wp.com/abglt.org.br/wp-content/uploads/2021/10/panquecas-americanas.jpg?fit=1361%2C766&ssl=1', 1, 6, '/detalhe/106'),
('Sopa de Abóbora', 'Ideal para dias frios e noites aconchegantes', '/uploads/sopa.jpg', 1, 7, NULL);