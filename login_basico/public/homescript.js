fetch('/ver', {
    credentials: "include"
}).then(res => {
    if (res.ok) {
        res.text().then(re => JSON.parse(re)).then(obj => {
            // dps elabora os dados ai no site; vai receber:
            // obj.email, obj.nome
        })
    } else {
        res.text().then(re => {
            alert(re)
            document.location.href = 'http://localhost:8080/'
        })
    }
})