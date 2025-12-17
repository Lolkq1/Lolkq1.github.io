const nome = document.querySelector("#nome")
const email = document.querySelector("#email")
const senha = document.querySelector("#senha")
const btn = document.querySelector("#btn")
const btn2 = document.querySelector("#btn2")
const email2 = document.querySelector("#email2")
const senha2 = document.querySelector("#senha2")
btn.addEventListener("click", () => {
    fetch('/create', {
        method:'POST',
        body: JSON.parse({
            nome: nome.value,
            email: email.value,
            senha: senha.value
        })
    }).then(res => {
        res.text().then(re => {
            alert(re)
            if (res.ok) {
            document.location.href = 'http://localhost:8080/homepage.html'
        }
        })
    })
})

btn2.addEventListener('click', () => {
    fetch('/login', {
        method: 'POST',
        body: JSON.parse({
            email: email2.value,
            senha: senha2.value
        })
    }).then(res => res.text()).then(re => {
        alert(re)
        if (res.ok) {
            document.location.href = 'https://localhost:8080/homepage.html'
        }
    })
})