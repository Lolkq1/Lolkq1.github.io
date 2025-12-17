sistema simples de votação, incluindo criptografia com uso do módulo 'bcrypt' e geração de tokens de sessão por meio do módulo 'crypto', com armazenamento por parte do cliente por meio do <br>
Local Storage e armazenamento de dados por parte do servidor com o módulo 'mysql2' que permite uso do mysql local.<br>
--> setup<br>
CREATE DATABASE candidatos;<br>
CREATE TABLE candidatos (nome VARCHAR(40), votos INT, codigo INT)<br>
CREATE TABLE sessoes (token VARCHAR(100) PRIMARY KEY, email VARCHAR(100) NOT NULL);<br>
CREATE TABLE usuarios (email VARCHAR(100) PRIMARY KEY, nome VARCHAR(30) NOT NULL, hash VARCHAR(100) UNIQUE, votou BOOLEAN, codigo INT); <br>
CREATE TABLE admin (email VARCHAR(100) PRIMARY KEY, nome VARCHAR(40) NOT NULL, hash VARCHAR(100) UNIQUE);<br>
CREATE TABLE sessoes_a (token VARCHAR(100) PRIMARY KEY, email VARCHAR(100));<br>
"voto_branco" => INSERT INTO candidatos VALUES ("voto_branco", 0, 0)<br>
"sem_voto" => INSERT INTO candidatos VALUES ("sem_voto", 0, -1)<br>
<br>
para criar conta inicial de administrador (senha: ney) --> para alterar basta ir nas últimas linhas do app.js<br>
fetch('/resenha').then( res =><br>
    res.text().then(obj => console.log(obj)))<br>
^^^^ obtém a a senha criptografada e após isto:<br>
INSERT INTO admin VALUES ("qualquer_email", "qualquer_nome", "senha_criptografada")<br>
<br>
// para ver todos os commits desse projeto => github.com/Lolkq1/trabalho_4_bim
