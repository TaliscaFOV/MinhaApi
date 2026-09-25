create database if not exists minha_api_db;
use minha_api_db;

create table if not exists produto
(
	idProduto int auto_increment primary key,
    nome varchar(100) not null,
    preco decimal(10, 2) not null,
    estoque int not null default 0,
    ativo tinyint(1) not null default 1
);

create table if not exists cliente
(
	id int auto_increment primary key,
    nome varchar(100) not null,
    email varchar(100) not null,
    cpf varchar(11) not null,
    ativo tinyint(1) not null default 1
);

create table if not exists venda
(
	idVenda int auto_increment primary key,
    id_produto int,
    id_cliente int,
    data_venda date not null,
    valor_Unitario decimal(10, 2) not null,
    quantidade int,
    total_venda decimal(10, 2),
    FOREIGN KEY (id_produto) REFERENCES produto(id),
	FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);
create table if not exists funcionario(
idFuncionario int auto_increment primary key,
nome varchar(100) not null,
cargo varchar(50) not null
);
create table if not exists departamento(
idDepartamento int auto_increment primary key,
nome varchar (100) not null,
descricao varchar (100),
ativo tinyint(1)not null,
idFuncionario int,
FOREIGN KEY (idFuncionario) REFERENCES funcionario(idFuncionario)
);