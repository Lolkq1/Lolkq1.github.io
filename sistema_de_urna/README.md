sistema simples de votação, incluindo criptografia com uso do módulo 'bcrypt' e geração de tokens de sessão por meio do módulo 'crypto', com armazenamento local de dados por meio do
Local Storage.

--> setup
CREATE DATABASE candidatos;
CREATE TABLE candidatos (nome VARCHAR(40), votos INT, codigo INT)
CREATE TABLE sessoes (token VARCHAR(100) PRIMARY KEY, email VARCHAR(100) NOT NULL);
CREATE TABLE usuarios (email VARCHAR(100) PRIMARY KEY, nome VARCHAR(30) NOT NULL, hash VARCHAR(100) UNIQUE, votou BOOLEAN, codigo INT); 
CREATE TABLE admin (email VARCHAR(100) PRIMARY KEY, nome VARCHAR(40) NOT NULL, hash VARCHAR(100) UNIQUE);
CREATE TABLE sessoes_a (token VARCHAR(100) PRIMARY KEY, email VARCHAR(100));
"voto_branco" => INSERT INTO candidatos VALUES ("voto_branco", 0, 0)
"sem_voto" => INSERT INTO candidatos VALUES ("sem_voto", 0, -1)

para criar conta inicial de administrador (senha: ney) --> para alterar basta ir nas últimas linhas do app.js
fetch('/resenha').then( res =>
    res.text().then(obj => console.log(obj)))
^^^^ obtém a a senha criptografada e após isto:
INSERT INTO admin VALUES ("qualquer_email", "qualquer_nome", "senha_criptografada")

// para ver todos os commits desse projeto => github.com/Lolkq1/trabalho_4_bim
