CREATE DATABASE IF NOT EXISTS minha_api_db;
USE minha_api_db;

CREATE TABLE IF NOT EXISTS produto (
    idProduto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    foto VARCHAR(255) NULL
);

SET @coluna_foto_existe = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'produto'
      AND column_name = 'foto'
);
SET @sql_add_foto = IF(
    @coluna_foto_existe = 0,
    'ALTER TABLE produto ADD COLUMN foto VARCHAR(255) NULL',
    'SELECT 1'
);
PREPARE stmt_add_foto FROM @sql_add_foto;
EXECUTE stmt_add_foto;
DEALLOCATE PREPARE stmt_add_foto;

CREATE TABLE IF NOT EXISTS cliente (
    idCliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    ativo TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS pedido_venda (
    idPedido INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    data_venda DATETIME NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES cliente(idCliente)
);

CREATE TABLE IF NOT EXISTS venda (
    idVenda INT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT NOT NULL,
    data_venda DATETIME NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    preco_total DECIMAL(10,2) NOT NULL,
    idCliente INT NOT NULL,
    idProduto INT NOT NULL,
    idPedido INT NULL,
    FOREIGN KEY (idCliente) REFERENCES cliente(idCliente),
    FOREIGN KEY (idProduto) REFERENCES produto(idProduto),
    CONSTRAINT fk_venda_pedido FOREIGN KEY (idPedido) REFERENCES pedido_venda(idPedido)
);

SET @coluna_idPedido_existe = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'venda'
      AND column_name = 'idPedido'
);
SET @sql_add_idPedido = IF(
    @coluna_idPedido_existe = 0,
    'ALTER TABLE venda ADD COLUMN idPedido INT NULL',
    'SELECT 1'
);
PREPARE stmt_add_idPedido FROM @sql_add_idPedido;
EXECUTE stmt_add_idPedido;
DEALLOCATE PREPARE stmt_add_idPedido;

SET @fk_idPedido_existe = (
    SELECT COUNT(*)
    FROM information_schema.table_constraints
    WHERE constraint_schema = DATABASE()
      AND table_name = 'venda'
      AND constraint_name = 'fk_venda_pedido'
);
SET @sql_add_fk_idPedido = IF(
    @fk_idPedido_existe = 0,
    'ALTER TABLE venda ADD CONSTRAINT fk_venda_pedido FOREIGN KEY (idPedido) REFERENCES pedido_venda(idPedido)',
    'SELECT 1'
);
PREPARE stmt_add_fk_idPedido FROM @sql_add_fk_idPedido;
EXECUTE stmt_add_fk_idPedido;
DEALLOCATE PREPARE stmt_add_fk_idPedido;

CREATE TABLE IF NOT EXISTS fornecedor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    ativo TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS funcionario (
    idFuncionario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS departamento (
    idDepartamento INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(100),
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    idFuncionario INT,
    FOREIGN KEY (idFuncionario) REFERENCES funcionario(idFuncionario)
);
USE minha_api_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    ativo      TINYINT(1)   NOT NULL DEFAULT 1
);

INSERT IGNORE INTO usuarios (nome, email, senha_hash)
VALUES ('Admin SENAI', 'admin@senai.com',
        '$2a$11$tIH4Qqrneoh855hh.63nQOwBznC.GG8QlNEpoLPJ.7MkcAiLhW41e');
Select * from usuarios;