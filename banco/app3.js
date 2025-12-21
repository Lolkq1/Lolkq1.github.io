require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const mysql = require('mysql2/promise')
const cookie_parser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// usuarios => CREATE TABLE usuarios (CPF INT PRIMARY KEY, nome VARCHAR(30) NOT NULL, senha VARCHAR(100), email VARCHAR(65) UNIQUE);
// cartoes => CREATE TABLE cartoes (CPF INT, numero PRIMARY KEY, senha VARCHAR(100), saldo (VE O TIPO DPS V2));
// transacoes => CREATE TABLE transacoes (ID INT AUTO_INCREMENT PRIMARY KEY, rem INT, des INT, quantia (VE O TIPO DPS), data DATE)
async function rodar() {
    const con = await mysql.createConnection({
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: 3306
    })
    app.use(express.json())
    app.use(express.static(path.join(__dirname, 'public')))
    app.use(cookie_parser())
    let l;
    app.use(async (req, res, next) => {
        if (req.cookies.sessionToken == undefined || req.cookies.sessionToken == null) {
            switch (req.url) {
                case '/paginaInicial.html':
                case '/transacao':
                case '/criar_cartao':
                    return res.status(401).send('vc nao deveria estar aqui.')
                default:
                    next()
                    break;
            }
        } else {
            switch (req.url) {
                case '/criar':
                case '/login':
                return res.status(401).send('você já está logado em uma conta.')
            }
            try {
                let k = jwt.verify(req.cookies.sessionToken, process.env.SECRET_KEY)
                l=k
                let j = await con.query('SELECT * FROM usuarios WHERE CPF=?', [k.payload.cpf])
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
                            maxAge: 1000*60*60*24
                        })
                        console.log('erro interno; mais de um usuário com o mesmo CPF.')
                        return res.status(500).send('erro interno no servidor.')
                }
                next()
            } catch {
                console.log('sessao inválida')
                return res.status(401).send('sessao inválida.')
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
        try {
            parseInt(req.body.login)
            k='email'
        } catch {
            console.log('login feito por email.')
            k='CPF'
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
                console.log('senha correta inserida. Autorizando acesso...')
                let newDados = {
                        email: dados.email,
                        cpf: dados.cpf
                }
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
                    let senha = bcrypt.hash(dados.senha, 10)
                    e++
                    await con.query('INSERT INTO usuarios (nome, CPF, senha, email) VALUES (?,?,?,?)', [dados.nome, dados.cpf, senha, dados.email])
                    e++
                    let newDados = {
                        email: dados.email,
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
        // vai receber: as credenciais no header, destinatário, quantia, numero, senha
        let dados = req.body
        let a=''
        let t;
        let e=0
        try {
            parseInt(dados.des.chave)
            a='CPF'
        } catch {
            a='email'
        }
        try {
            let d = await con.query(`SELECT * FROM usuarios WHERE ${a}=?`, [dados.des.chave])
            e++
            if (d[0].length === 0) {
                console.log('transacao: remetente nao existe')
                return res.status(401).send('transacao: destinatário inexistente.')
            } else if (d[0].length > 1) {
                console.log('transacao: mais de um usuário com o mesmo cpf ou email.')
                return res.status(500).send('erro interno mt loko')
            } else {
                let k = await con.query('SELECT * FROM cartoes WHERE numero=?', [dados.rem.numero])
                e++
                if (k[0].length === 0) {
                    console.log('cartao inexistente.')
                    return res.status(401).send('o cartao não existe.')
                } else {
                    let k2 = bcrypt.compare(dados.senha, k[0][0].senha)
                e++
                if (!k2) {
                    console.log('transacao: senha incorreta inserida.')
                    return res.status(401).send('senha incorreta inserida.')
                } else {
                    console.log('transacao: senha correta inserida.')
                    if (k[0][0].saldo >= dados.quantia) {
                        console.log('transacao: saldo suficiente. Autorizado.')
                        let t2 = await con.query('INSERT INTO transacoes (rem, des, quantia, data) VALUES (?,?,?, NOW())', l.cpf, d[0][0].CPF, dados.quantia)
                        t=t2
                        e++
                        console.log('transacao: transacao registrada.')
                        await con.query('UPDATE * FROM cartoes SET saldo=? WHERE CPF=?', [k[0][0].saldo - dados.quantia, l.cpf])
                        e++
                        await con.query('UPDATE * FROM cartoes SET saldo=? WHERE CPF=?', [d[0][0].saldo + dados.quantia, d[0][0].CPF])
                        e++
                        console.log('transacao: transacao realizada com sucesso.')
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
                    msg = 'transacao: erro na checagem de usuários.'
                    break;
                case 1:
                    msg = 'transacao: erro na checagem de cartoes.'
                    break;
                case 2:
                    msg = 'transacao: erro na comparaçao de senhas.'
                    break;
                case 3:
                    msg = 'transacao: erro no registro de transacoes.'
                    break;
                case 4:
                    msg = 'transacao: erro na reduçao de saldo do remetente. ID da transacao: '+ t[0][0].resultId
                    break;
                case 5:
                    msg = 'transacao: erro no aumento de saldo do destinatario. ID da transacao: '+ t[0][0].resultId
                    break;
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
        let {senha} = dados
        let e=0
        try {
            let numero = await geradordenumero(dados)
            e++
            await con.query('SELECT * FROM cartoes WHERE numero=?', [numero])
            e++
            let s = bcrypt.hash(senha, 10)
            e++
            await con.query('INSERT INTO cartoes (CPF, numero, senha, saldo) VALUES (?,?,?, 0)', [l.cpf, numero, s])
            return res.send('cartão registrado com sucesso!')
        } catch {
            switch (e) {
                case 0:
                    msg = 'criação de cartão: erro na geracao de numero do cartao.'
                    break;
                case 1:
                    msg = 'criação de cartão: erro na verificaçao de cartoes.'
                    break;
                case 2:
                    msg = 'criação de cartão: erro na geração de senha.'
                    break;
                case 3:
                    msg = 'criação de cartão: erro no registro do cartao na base de dados.'
                    break;
            }
            console.log(msg)
            return res.status(500).send('erro interno do servidor.')
        }
    })

    app.listen(8080, () => {
        console.log('servidor rodando na porta 8080')
    })
}
rodar()