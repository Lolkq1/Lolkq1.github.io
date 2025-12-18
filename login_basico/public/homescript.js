fetch('/ver', {
    credentials: "include"
}).then(res => {
    if (res.ok) {
        res.text().then(re => JSON.parse(re)).then(obj => {
            const nome = document.querySelector("#display_nome")
            const email = document.querySelector("#display_email")
            const logout_btn = document.querySelector("#logout_btn")
            // dps elabora os dados ai no site; vai receber:
            // obj.email, obj.nome
            nome.textContent = 'Nome: '+obj.nome
            email.textContent = 'Email: '+obj.email
            logout_btn.addEventListener("click", () => {
                let k = confirm('tem certeza que deseja sair de sua conta?')
                if (k==true) {
                    fetch('/apagar', {
                        credentials: "include"
                    }).then(res => res.text()).then(obj=> {
                        alert(obj)
                        if (res.ok) {
                            location.href = 'http://localhost:8080/'
                        } 
                    })
                }
            })
        })
    } else {
        res.text().then(re => {
            alert(re)
            document.location.href = 'http://localhost:8080/'
        })
    }
})