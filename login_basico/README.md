sistema de login com uso de Express, mysql2 para gerenciamento dos dados, crypto pra geração de tokens de sessão e bcrypt para criptografia de senha. <br>
configuração do banco de dados (linha de comando mySQL local)<br>
CREATE DATABASE qualquer_nome; <br>
use qualquer_nome; <br>
CREATE TABLE usuarios (email VARCHAR(65) PRIMARY KEY, nome VARCHAR(30) NOT NULL, hash VARCHAR(100)); <br>
CREATE TABLE tokens (email VARCHAR(65) NOT NULL, token VARCHAR(100) PRIMARY KEY);
