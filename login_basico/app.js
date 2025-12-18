require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const mysql2 = require('mysql2/promise')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const cookie_parser = require('cookie-parser')
app.use(cookie_parser())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

async function funcao() {
    const con = await mysql2.createConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: 3306,
    database: process.env.DATABASE
})
    app.listen(8080, () => {
    console.log('servidor rodando na porta 8080')
})
    
function errsvr(res, p) {
    console.log('erro interno do servidor'); res.status(500).send('erro interno do sv')
}

app.post('/create', async (req, res) => {
        let b2 = req.body
        console.log(b2)
        let a = crypto.randomBytes(32)
        let tkn = crypto.createHash('sha256').update(a).digest('hex')
        try {
            if (b2.nome.length > 30 || b2.email.length > 65) {
                console.log('os dados inseridos nao atendem aos criterios.')
                return res.status(401).send('dados nao atendem aos criterios.')
            } else {
                console.log(b2.email)
                let [data] = await con.query("SELECT * FROM usuarios WHERE email=?", [b2.email])
                if (data.length > 0){
                console.log('email ja atribuido a uma conta')
                    return res.status(401).send('esse email já está atribuido a uma conta.')
                } else {
                    let hash = await bcrypt.hash(b2.senha, 10)
                    await con.query('INSERT INTO usuarios VALUES(?,?,?)', [b2.email, b2.nome, hash])
                    await con.query("INSERT INTO tokens VALUES (?,?)", [b2.email, tkn])
                    res.cookie('sessionToken', tkn, {
                        httpOnly: true,
                        sameSite: 'strict',
                        })
                    return res.send('usuario criado com sucesso.')
                
            }
            } 
        } catch {
            errsvr(res)
        }
})

app.post('/login', async (req, res) => {
        let r2 = req.body
        try {
            let [data] = await con.query('SELECT * FROM usuarios WHERE email=?', [r2.email])
                if (data.length === 0) {
                    console.log('usuario inexistente.')
                    return res.status(401).send('usuario inexistente')
                } else {
                    let result = await bcrypt.compare(r2.senha, data[0].hash)
                        if (!result) {
                            console.log('senha incorreta inserida')
                            return res.status(401).send('senha incorreta inserida')
                        }  else {
                            console.log('usuario logado')
                            let a = crypto.randomBytes(32)
                            a+=r2.email
                            let tkn = crypto.createHash('sha256').update(a).digest('hex')
                            res.cookie('sessionToken', tkn, {
                                sameSite: 'strict',
                                httpOnly: true
                            })
                            await con.query("INSERT INTO tokens VALUES (?,?)", [r2.email, tkn])
                            console.log('login autorizado!')
                            return res.send('logado com sucesso!')
                        }
                }
        } catch {
            errsvr(res)
        }
       
})

app.get('/ver', async (req, res) => {
    console.log(req.cookies.sessionToken)
    if (req.cookies.sessionToken == ' ') {
        return res.status(401).send('credenciais vazias. Usuário não está logado.')
    } else {
        try {
            let [data] = await con.query("SELECT * FROM tokens WHERE token=?", [req.cookies.sessionToken])
            if (data.length === 0) {
                    return res.status(401).send('token de sessão não registrado.')
            } else {
                let [data2] = await con.query("SELECT nome, email FROM usuarios WHERE email=?", [data[0].email])
                if (data2.length === 0) {
                    return res.status(401).send('token registrado, porém usuario inexistente.')
                } else {
                    return res.send(JSON.stringify(data2[0]))
                }
            }
        } catch {
            errsvr(res)
        }
    }
})

app.get('/apagar', (req, res) => {
    if (req.cookies.sessionToken == undefined) {
        res.status(401).send('cookie inexistente.')
    } else {
        res.cookie('sessionToken', ' ', {
            sameSite:'strict',
            httpOnly: true
        })
        return res.send('logout foi feito com sucesso')
    }
})

}

funcao()
