require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const mysql = require('mysql2/promise')
const cookie_parser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// usuarios => CREATE TABLE usuarios (CPF INT PRIMARY KEY, nome VARCHAR(30) NOT NULL, senha VARCHAR(100), email VARCHAR(65) UNIQUE);
// cartoes => CREATE TABLE cartoes (CPF INT, numero PRIMARY KEY, senha VARCHAR(100), dinheiro (VE O TIPO DPS V2));
// transacoes => CREATE TABLE transacoes (rem INT, des INT, quantia (VE O TIPO DPS))
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

    app.use(async (req, res, next) => {
        if (req.cookies.sessionToken == undefined) {
            switch (req.url) {
                case '/paginaInicial':
                case '/transacao':
                case '/dados':
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
                let j = await con.query('SELECT * FROM usuarios WHERE CPF=?', [k.payload.cpf])
                switch (j) {
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
                            sameSite: 'strict'
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
                    sameSite: 'strict'
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
                        console.log('tem mais de um usuario aii ahahaiehaihaj')
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
                        httpOnly: true
                    })
                    res.send('usuário criado e logado automaticamente com sucesso!')
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
        let k=''
        try {
            parseInt(dados.des.chave)
            k='CPF'
        } catch {
            k='email'
        }

        try {
            let d = await con.query(`SELECT * FROM usuarios WHERE ${k}=?`, [dados.des.chave])
            if (d[0].length === 0) {
                console.log('transacao: remetente nao existe')
                res.status(401).send('destinatário inexistente.')
            } else if (d[0].length > 1) {
                console.log('mais de um usuário com o mesmo cpf ou email.')
                res.status(500).send('erro interno mt loko')
            } else {
                
            }
        } catch {

        }
    })
}
rodar()


