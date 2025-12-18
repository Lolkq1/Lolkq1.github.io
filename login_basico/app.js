require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const mysql2 = require('mysql2/promise')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const cookie_parser = require('cookie-parser')
    const con = await mysql2.createConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: 3306,
    database: 'teste'
    })

app.use(cookie_parser())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


function errsvr(res) {
    console.log('erro interno do servidor'); res.status(500).send('erro interno do sv')
}

app.post('/create', async (req, res) => {
        try {
        let b2 = req.body
        let a = crypto.randomBytes(32)
        let tkn = crypto.createHash('sha256').update(a).digest('hex')
            if (b2.nome.length > 30 || b2.email.length > 100) {
                console.log('os dados inseridos nao atendem aos criterios.')
                return res.status(401).send('dados nao atendem aos criterios.')
            } else {
                let [data] = await con.query('SELECT * FROM usuarios WHERE email=?', [b2.email])
                if (data.length > 0){
                console.log('email ja atribuido a uma conta')
                    return res.status(401).send('esse email já está atribuido a uma conta.')
                } else {
                    let hash = await bcrypt.hash(b2.senha, 5)
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
        // o antigo tá perdido, isso aqui é uma refatoraçao erronea do codigo
        // try {
        //     if (b2.nome.length > 30 || b2.email.length > 100) {
        //         console.log('os dados inseridos nao atendem aos criterios.')
        //         res.status(401).send('dados nao atendem aos criterios.')
        //     } else {
        //         let resenha = new Promise(con.query('SELECT * FROM usuarios WHERE email=?', [b2.email]))
        //         let data = await resenha
        //         try {
        //             if (data.length > 0) {
        //                 console.log('email ja atribuido a uma conta')
        //                 res.status(401).send('esse email já está atribuido a uma conta.')
        //             } else {
        //                 let resenha2 = new Promise(con.query("INSERT INTO usuarios VALUES (?,?,?)", [b2.email, b2.nome, hash]))
        //                 try {
        //                     let dat = (new Date()).toString()
        //                     dat+=b2.email
        //                     let tkn = crypto.createHash('sha256').update(dat).digest('hex')
                            
        //                     try {
        //                         res.cookie('sessionToken', tkn, {
        //                                 httpOnly: true,
        //                                 sameSite: 'strict',
        //                             })
        //                             res.send('usuario criado com sucesso.')
        //                     } catch {
        //                         errsvr(res)
        //                     }
        //                 } catch {
        //                     errsvr(res)
        //                 }
        //             }
        //         } catch {
        //             errsvr(res)
        //         }

            //     con.query('SELECT * FROM usuarios WHERE email=?', [b2.email], (err,data) => {
            //     if (err) {errsvr(res); console.log(2)} else {
            //         if (data.length > 0) {
            //             console.log('email ja atribuido a uma conta')
            //             res.status(401).send('esse email já está atribuido a uma conta.')
            //         } else {
            //             con.query('INSERT INTO usuarios VALUES (?,?,?)', [b2.email, b2.nome, hash], (err) => {
            //             if (err) {errsvr(res); console.log(3)} else {
            //                 let dat = (new Date()).toString()
            //                 dat+=b2.email
            //                 let tkn = crypto.createHash('sha256').update(dat).digest('hex')
            //                 con.query('INSERT INTO tokens VALUES (?,?)', [b2.email, tkn] ,(err) => {
            //                     if (err) {errsvr(res); console.log(4)} else {
            //                         res.cookie('sessionToken', tkn, {
            //                             httpOnly: true,
            //                             sameSite: 'strict',
            //                         })
            //                         res.send('usuario criado com sucesso.')
            //                     }
            //                 })
            //             }
            // })
            //         }
            //     }
            // })
        //     }
        // } catch {
        //     errsvr(res)
        // }
         
})

app.post('/login', async (req, res) => {
        let r2 = req.body
        //novo
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
        //vai vir tipoo r2.email, r2.senha
        // antigo
        // con.query("SELECT * FROM usuarios WHERE email=?", [r2.email], (err, data) =>  {
        //     if (err) {errsvr(res); } else  if (data.length === 0) {
        //             console.log('usuario inexistente.')
        //             res.status(401).send('usuario inexistente')
        //         } else {
        //             bcrypt.compare(r2.senha, data[0].hash).then(result => {
        //                 if (!result) {
        //                     console.log('senha incorreta inserida')
        //                     res.status(401).send('senha incorreta inserida')
        //                 } else {
        //                     console.log('usuario logado')
        //                     let dat = (new Date()).toString()
        //                     dat+=r2.email
        //                     let tkn = crypto.createHash('sha256').update(dat).digest('hex')
        //                     res.cookie('sessionToken', tkn, {
        //                         sameSite: 'strict',
        //                         httpOnly: true
        //                     })
        //                     con.query('INSERT INTO tokens VALUES (?,?)', [r2.email, tkn], (err, data) => {
        //                         if (err) {errsvr(res)} else {
        //                             console.log('login autorizado.')
        //                             res.send('logado com sucesso!')
        //                         }
        //                     })
        //                 }
        //             })
        //         }

            
        // })
})

//     meu parse manual sdds :( s2
//     function parsec(cookie) {
//     if (typeof cookie != 'string') {
//         return false
//     } else {
//         let j = false
//         let j2 = false
//         for (x of cookie) {
//             if (x==';') {
//                 j = true
//             } else if (x=='=') {
//                 j2 = true
//             }
//         }
//             if (j2 != true) {
//                 return false
//             } else if (j == true) {
//                 let c = cookie.split(';')
//                 let a = []
//                 for (x in c) {
//                     c[x].split('=')
//                 }
//                 for (x in a) {
//                     for (y in a[x]) {
//                         if (a[x][y] == 'sessionToken') {
//                             return a[x][parseInt(y+1)]
//                         }
//                     }
//                 }
//                 return false
//             } else {
//                     let c = cookie.split('=')
//                     for (x in c) {
//                             if (c[x] == 'sessionToken') {
//                                 return c[parseInt(x+1)]
//                             }
//                     }
//                     return false
//                 }
//     }
    
// }

app.get('/ver', async (req, res) => {
    if (req.cookies.sessionToken == undefined) {
        return res.status(401).send('credenciais vazias. Usuário não está logado.')
    } else {
        //novo
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
        //antigo
        // con.query("SELECT * FROM tokens WHERE token=?", [w], (err, data) => {
        //     if (err) {errsvr(res)} else {
        //         if (data.length === 0) {
        //             res.status(401).send('token de sessão não registrado.')
        //         } else {
        //             con.query('SELECT nome, email FROM usuarios WHERE email=?', [data[0].email], (err, data2) => {
        //                 if (err) {errsvr(res)} else {
        //                     if (data2.length === 0) {
        //                         res.status(401).send('token registrado, porém usuário inexistente.')
        //                     } else {
        //                         res.send(JSON.stringify(data2[0]))
        //                     }
        //                 }        
        //             })
                    
        //         }
        //     }
        // })
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

app.listen(8080, () => {
    console.log('servidor rodando na porta 8080')
})

