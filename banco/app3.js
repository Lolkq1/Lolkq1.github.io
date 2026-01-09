require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const mysql = require('mysql2/promise')
const cookie_parser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// usuarios => CREATE TABLE usuarios (CPF VARCHAR(11) PRIMARY KEY, nome VARCHAR(30) NOT NULL, senha VARCHAR(255), email VARCHAR(254) UNIQUE);
// cartoes => CREATE TABLE cartoes (CPF VARCHAR(11), numero VARCHAR(16) PRIMARY KEY, senha VARCHAR(100), saldo DECIMAL(12, 2));
// transacoes => CREATE TABLE transacoes (ID BIGINT AUTO_INCREMENT PRIMARY KEY, rem VARCHAR(16), des VARCHAR(16), quantia DECIMAL(12, 2)), data DATETIME, rem_cpf VARCHAR(11), des_cpf VARCHAR(11));
async function rodar() {
    const con = await mysql.createConnection({
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: 3306
    })
    app.use(express.json())
    app.use(cookie_parser())
    app.use(async (req, res, next) => {
        if (req.cookies.sessionToken == undefined || req.cookies.sessionToken == null) {
            switch (req.url) {
                case '/':
                case '/cartoes.html':
                case '/transacoes.html':
                case '/registrar_cartao.html':
                case '/transacao':
                case '/criar_cartao':
                    return res.status(401).send('vc nao deveria estar aqui.')
                default:
                    app.use(express.static(path.join(__dirname, 'public')))
                    next()
                    break;
            }
        } else {
            switch (req.url) {
                case '/criar':
                case '/login':
                case '/create.html':
                return res.status(401).send('você já está logado em uma conta.');
                default:
                    app.use(express.static(path.join(__dirname, 'public')))
                    next()
                    break;
            }
            let e=0
            try {
                let k = jwt.verify(req.cookies.sessionToken, process.env.SECRET_KEY)
                e++
                let j = await con.query('SELECT * FROM usuarios WHERE CPF=?', [k.cpf])
                e++
                switch (j[0].length) {
                    case 0:
                        res.cookie('sessionToken', undefined, {
                            httpOnly: true,
                            sameSite: 'strict'
                        })
                        return res.status(401).send('usuário inexistente.')
                    case 1:
                        break;
                    default:
                        res.cookie('sessionToken', undefined, {
                            httpOnly: true,
                            sameSite: 'strict',
                            expires: true,
                            maxAge: 1
                        })
                        console.log('erro interno; mais de um usuário com o mesmo CPF.')
                        return res.status(500).send('erro interno no servidor.')
                }
                next()
            } catch {
                switch (e) {
                    case 0:
                        console.log('erro na verificaçao do jogador caro por JWT.')
                        return res.status(401).send('sessao inválida.')
                    case 1:
                        console.log('erro na verificaçao do jogador por cpf.')
                        return res.status(401).send('sessao inválida.')
                    case 2:
                        console.log('nao de nem agua')
                        return res.status(401).send('sesion inbalida')
                }
            }
        }
    })

    async function geradordenumero(dados) {
        //dps eu faço
    }

    app.post('/login', async (req, res) => {
        let dados = req.body
        let e=0 //isso aq é pra debuggar
        let k='' // isso é p definir se ta tentando logar com cpf ou com email
        console.log(dados.login)
        switch (isNaN(parseInt(dados.login))) {
            case true: 
                console.log('login feito por email.')
                k='email'
            break;
            default: 
                console.log('login feito por cpf.')
                k='CPF'
            break;
        }
        switch(k) {
            case 'CPF':
                if (k.length != 11) {
                    return res.status(401).send('cpf incorretamente formatado.')
                }
                break;
            case 'email':
                if (k.length > 254) {
                    return res.status(401).send('email excede o tamanho permitido.')
                }
        }
        try {
            let d1 = await con.query(`SELECT * FROM usuarios WHERE ${k}=?`, [dados.login])
            e++
            switch (d1[0].length) {
                case 0:
                    console.log('usuário inexistente.')
                    return res.status(401).send('usuário inexistente.')
                case 1:
                    console.log('usuário encontrado')
                    break;
                default:
                    console.log('erro inesperado; mais de um usuário possui este email/email.')
                    return res.status(500).send('erro interno mt louko')
            }
            let d2 = await bcrypt.compare(dados.senha, d1[0][0].senha)
            e++
            if (!d2) {
                return res.status(401).send('senha incorreta inserida.')
            } else {
                let newDados;
                switch(k) {
                    case 'cpf':
                        newDados = {
                        cpf: dados.cpf
                    }
                    break;
                    case 'email':
                        newDados = {
                            cpf: d1[0][0].CPF
                        }
                }
                console.log('senha correta inserida. Autorizando acesso...')
                res.cookie('sessionToken', jwt.sign(newDados, process.env.SECRET_KEY), {
                    httpOnly: true,
                    sameSite: 'strict',
                    expires: true,
                    maxAge: 1000*60*60*24
                })
                res.send('usuário autorizado!')
            }
            
        } catch {
            console.log('etapas sem erro:', e)
            switch (e) {
                case 0:
                    console.log('erro na procura de usuarios')
                    break;
                case 1:
                    console.log('erro na comparaçao das senhas.')
                    break;
            }
            return res.status(500).send('erro interno do servidor.')
        }
    })

    app.post('/criar', async (req, res) => {
        let dados = req.body
        let e=0
        if (dados.cpf.length != 11 || dados.email.length > 254 || dados.nome.length > 30 || dados.senha.length > 254) {
            return res.status(401).send('dados formatados incorretamente; verifique e tente novamente.')
        }
        try {
            let d1 = await con.query('SELECT * FROM usuarios WHERE CPF=? OR email=?', [dados.cpf, dados.email])
            e++
                switch (d1[0].length) {
                    case 0:
                        break;
                    case 1:
                        console.log('criaçao de conta: já existe alguem com esse CPF/email registrado.')
                        return res.status(401).send('já existe uma conta com esse CPF/email cadastrado.')
                    default:
                        console.log('criaçao de conta: tem mais de um usuario aii ahahaiehaihaj')
                        return res.status(500).send('erro interno mt loko')
                }
                    let senha = await bcrypt.hash(dados.senha, 10)
                    e++
                    console.log(dados)
                    await con.query('INSERT INTO usuarios VALUES (?,?,?,?)', [dados.cpf, dados.nome, senha, dados.email])
                    e++
                    let newDados = {
                        cpf: dados.cpf
                    }
                    res.cookie('sessionToken', jwt.sign(newDados, process.env.SECRET_KEY), {
                        sameSite: 'strict',
                        httpOnly: true,
                        expires: true,
                        maxAge: 1000*60*60*24
                    })
                    console.log('criaçao de conta: usuário criado com sucesso.')
                    return res.send(JSON.stringify({
                        nome: dados.nome,
                        email: dados.email
                    }))
        } catch {
            switch (e) {
                case 0: 
                    console.log('erro na verificaçao dos usuarios')
                    break;
                case 1:
                    console.log('erro na criptografia da senha')
                    break;
                case 2:
                    console.log('erro ao inserir usuário')
                    break;
            }
            res.status(500).send('erro interno do servidor.')
        }
    })

    app.post('/transacao', async (req, res) => {
        // vai receber: as credenciais no cookie (verificaçao jwt), destinatário, quantia, numero, senha, cartao do destinatario
        let dados = req.body
        let a=''
        let e=0
        switch (isNaN(parseInt(dados.des.chave))) {
            case true: 
                console.log('chave: email.')
                a='email'
            break;
            default: 
                console.log('chave: cpf.')
                a='CPF'
            break;
        }
        try {
            let l2 = await jwt.verify(req.cookies.sessionToken);
            let l = await con.query("SELECT * FROM users WHERE CPF=?", l2.cpf)
            e++
            let d = await con.query(`SELECT * FROM usuarios WHERE ${a}=?`, [dados.des.chave])
            e++
            if (d[0].length === 0) {
                console.log('transacao: destinatario nao existe')
                return res.status(401).send('transacao: destinatário inexistente.')
            } else if (d[0].length > 1) {
                console.log('transacao: mais de um usuário com o mesmo cpf ou email.')
                return res.status(500).send('erro interno mt loko')
            } else {
                let k = await con.query('SELECT * FROM cartoes WHERE numero=?', [dados.rem.numero])
                let k3 = await con.query("SELECT * FROM cartoes WHERE CPF=?", [d[0][0].CPF])
                e++
                if (k[0].length === 0 || k3[0].length === 0) {
                    console.log('cartao(es) inexistente.')
                    return res.status(401).send('o(s) cartao(es) não existe(m).')
                } else {
                    let k2 = await bcrypt.compare(dados.senha, k[0][0].senha)
                e++
                if (!k2) {
                    console.log('transacao: senha incorreta inserida.')
                    return res.status(401).send('senha incorreta inserida.')
                } else {
                    console.log('transacao: senha correta inserida.')
                    if (k[0][0].saldo >= dados.quantia) {
                        console.log('transacao: saldo suficiente. Autorizado.')
                        let t2 = await con.query('START TRANSACTION; INSERT INTO transacoes (rem, des, quantia, data, rem_cpf, des_cpf) VALUES (?,?,?, NOW(),?,?); UPDATE cartoes SET saldo=? WHERE numero=?; UPDATE cartoes SET saldo=? WHERE numero=?; IF @@ERROR <> 0 BEGIN ROLLBACK; END ELSE BEGIN COMMIT; END;'
                        , dados.rem.numero, k3[0][0].numero, dados.quantia, l[0][0].CPF, k[0][0].saldo - dados.quantia, dados.rem.numero, d[0][0].saldo + dados.quantia, k3[0][0].numero)
                        e++
                        return res.send('transação realizada com sucesso!')
                    } else {
                        console.log('transacao: saldo insuficiente.')
                        return res.status(401).send('saldo insuficiente.')
                    }
                }
                }
            }
        } catch {
            let msg=''
            switch (e) {
                case 0:
                    msg = 'transacao: erro na verificaçao de remetente.'
                    break;
                case 1:
                    msg = 'transacao: erro na verificaçao de destinatario'
                    break;
                case 2:
                    msg = 'transacao: erro na verificacao de cartoes.'
                    break;
                case 3:
                    msg = 'transacao: erro na comparacao de senhas.'
                    break;
                case 4:
                    msg = 'transacao incompleta: erro interno.'
                default:
                    msg = 'erro incomum.'
                    break;
            }
            console.log(msg)
            return res.status(500).send('erro interno do servidor.')
        }
    })
    app.post('/criar_cartao', async (req, res) => {
        let dados = req.body
        let {senha_cartao, senha_usuario} = dados
        let e=0
        try {
            let l2 = await jwt.verify(req.cookies.sessionToken);
            let l = await con.query("SELECT * FROM users WHERE CPF=?", l2.cpf)
            e++
            let r = await bcrypt.compare(senha_usuario, l[0][0].senha)
            if (!r) {
                return res.status(401).send('senha de usuário incorreta.')
            }
            let numero = await geradordenumero(dados)
            e++
            await con.query('SELECT * FROM cartoes WHERE numero=?', [numero])
            e++
            let s = await bcrypt.hash(senha_cartao, 10)
            e++
            await con.query('INSERT INTO cartoes (CPF, numero, senha, saldo) VALUES (?,?,?, 0)', [l[0][0].cpf, numero, s])
            return res.send('cartão registrado com sucesso!')
        } catch {
            switch (e) {
                case 0:
                    msg = 'criação de cartao: erro na verificaçao do usuario.'
                    break;
                case 1:
                    msg = 'criação de cartão: erro na geracao de numero do cartao.'
                    break;
                case 2:
                    msg = 'criação de cartão: erro na verificaçao de cartoes.'
                    break;
                case 3:
                    msg = 'criação de cartão: erro na geração de senha.'
                    break;
                case 4:
                    msg = 'criação de cartão: erro no registro do cartao na base de dados.'
                    break;
            }
            console.log(msg)
            return res.status(500).send('erro interno do servidor.')
        }
    })

    app.get('/deslogar', async (req, res) => {
        res.cookie('sessionToken', undefined, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: '1',
            expires: true
        })
        res.send('logout feito com sucesso!')
    })

    app.get('/get_transacoes', async (req, res) => {
        let a=true
        try {
            let rem = await jwt.verify(req.cookies.sessionToken)
            a=false
            let tr = await con.query("SELECT * FROM transacoes WHERE rem_cpf=?", [rem.cpf])
            return res.send(tr[0])
        } catch {
            let code;
            let msg;
            if (a) {
                msg = 'erro de verificaçao do usuario'
                code = 401
            } else {
                msg = 'erro interno do servidor'
                code = 500
            }
            return res.status(code).send(msg)
        }
    })

    app.get('/get_cartoes', async (req,res) => {
        let a=true
        try {
            let user = await jwt.verify(req.cookies.sessionToken)
            a=false
            let tr = await con.query("SELECT numero,saldo FROM cartoes WHERE CPF=?", [user.cpf])
            return res.send(tr[0])
        } catch {
            let code;
            let msg;
            if (a) {
                msg = 'erro de verificaçao do usuario'
                code = 401
            } else {
                msg = 'erro interno do servidor'
                code = 500
            }
            return res.status(code).send(msg)
        }
    })
    app.listen(8080, () => {
        console.log('servidor rodando na porta 8080')
    })
}
rodar()