const express = require('express')
const app = express()
const path = require('path')
const mysql2 = require('mysql2')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const con = mysql2.createConnection({
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'teste'
})
app.use(express.static(path.join(__dirname, 'public')))

function errsvr(res) {
    console.log('erro interno do servidor'); res.status(500).send('erro interno do sv')
}

app.post('/create', (req, res) => {
    let b = ''
    req.on('data', (chunk) => {
        b+=chunk
    })
    req.on('end', () => {
        let b2 = JSON.parse(b)
        // ai vai terr... b2.nome, b2.email, b2.senha
        bcrypt.hash(b.senha, 5).then(hash => {
            if (b2.nome.length > 30 || b2.email.length > 100) {
                console.log('os dados inseridos nao atendem aos criterios.')
                res.status(401).send('dados nao atendem aos criterios.')
            } else {
                con.query('SELECT * FROM users WHERE email=?', [b2.email], (err,data) => {
                if (err) {errsvr(res)} else {
                    if (data.length > 1) {
                        console.log('email ja atribuido a uma conta')
                        res.status(401).send('esse email já está atribuido a uma conta.')
                    } else {
                        con.query('INSERT INTO users VALUES (?,?,?)', [b2.email, b2.nome, hash], (err) => {
                        if (err) {errsvr(res)} else {
                            let dat = (new Date()).toString()
                            dat+=b2.email
                            let tkn = crypto.createHash('sha256').update(dat).digest('hex')
                            con.query('INSERT INTO tokens VALUES (?,?)', [b2.email, tkn] ,(err) => {
                                if (err) {errsvr(res)} else {
                                    res.cookie('sessionToken', tkn, {
                                        httpOnly: true,
                                        sameSite: 'strict',
                                    })
                                    res.send('usuario criado com sucesso.')
                                }
                            })
                        }
            })
                    }
                }
            })
            }
            
        })
        
    }) 
})

app.post('/login', (req, res) => {
    let r=''
    req.on('data', (chunk) => {
        r+=chunk
    })
    req.on('end', () => {
        let r2 = JSON.parse(r)
        //vai vir tipoo r2.email, r2.senha
        con.query("SELECT * FROM users WHERE email=?", (err, data) =>  {
            if (err) {errsvr(res)} else  if (data.length === 0) {
                    console.log('usuario inexistente.')
                    res.status(401).send('usuario inexistente')
                } else {
                    bcrypt.compare(r2.senha, data[0].senha).then(result => {
                        if (!result) {
                            console.log('senha incorreta inserida')
                            res.status(401).send('senha incorreta inserida')
                        } else {
                            console.log('usuario logado')
                            let dat = (new Date()).toString()
                            dat+=r2.email
                            let tkn = crypto.createHash('sha256').update(dat).digest('hex')
                            res.cookie('sessionToken', tkn, {
                                sameSite: 'strict',
                                httpOnly: true
                            })
                            con.query('INSERT INTO tokens VALUES (?,?)', [r2.email, tkn], (err, data) => {
                                if (err) {errsvr(res)} else {
                                    console.log('login autorizado.')
                                    res.send('logado com sucesso!')
                                }
                            })
                        }
                    })
                }

            
        })
    })
})

 export function parsec(cookie) {
    if (typeof cookie != 'string') {
        return false
    } else {
        let j = false
        let j2 = false
        for (x of cookie) {
            if (x==';') {
                j = true
            } else if (x=='=') {
                j2 = true
            }
        }
        if (j2 != true || j != true) {
            return false
        } else {
            let c = cookie.split(';')
            for (x in c) {
                for (y in c[x]) {
                    if (c[x][y] == 'sessionToken') {
                        return c[x][y+1]
                    }
                }
            }
            return false
        }
    }
    
}

app.get('ver', (req, res) => {
    let w = parsec(req.headers.cookie)
    if (w == false) {
        res.status(401).send('credenciais vazias. Usuário não está logado.')
    } else {
        con.query("SELECT * FROM tokens WHERE token=?", [w], (err, data) => {
            if (err) {errsvr(res)} else {
                if (data.length === 0) {
                    res.status(401).send('token de sessão não registrado.')
                } else {
                    con.query('SELECT nome, email FROM usuarios WHERE email=?', [data[0].email], (err, data2) => {
                        if (err) {errsvr(res)} else {
                            if (data2.length === 0) {
                                res.status(401).send('token registrado, porém usuário inexistente.')
                            } else {
                                res.send(JSON.stringify(data2[0]))
                            }
                        }        
                    })
                    
                }
            }
        })
    }
})

app.listen(8080)