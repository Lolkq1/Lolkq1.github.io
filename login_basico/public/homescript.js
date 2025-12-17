fetch('/ver', {
    credentials: "include"
}).then(res => {
    if (res.ok) {
        res.text().then(re => JSON.parse(re)).then(obj => {
            const nome = document.querySelector("#display_nome")
            const email = document.querySelector("#display_email")
            // dps elabora os dados ai no site; vai receber:
            // obj.email, obj.nome
            nome.textContent = 'Nome: '+obj.nome
            email.textContent = 'Email: '+obj.email
        })
    } else {
        res.text().then(re => {
            alert(re)
            document.location.href = 'http://localhost:8080/'
        })
    }
})