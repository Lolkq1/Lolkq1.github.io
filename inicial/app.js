const express = require('express')
const app = express()
const path = require('path')
const crypto = require('crypto')
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/santos', (req, res) => {
    let r = ''
    req.on('data', (chunk) => {
        r+=chunk
    })
    req.on('end', () => {
        let r2 = JSON.parse(r)
        console.log(r2)
        let token = crypto.createHash('sha256').update(r2.mundial).digest('hex')
        res.cookie('teste', token)
        console.log(token)
        res.send(token)
    })
})
// const http = require('http')
// const sv = http.createServer((req, res) => {
//     // resenha!
//     if (req.url === '/resenha') {
//         console.log('iae')
//     }
// })
// sv.listen(8080)
app.listen(8080)