let currentDiv = document.querySelector("#main")
let j1galaxy = document.querySelector("#card_perfil")
function switchDivs(div) {
    currentDiv.style.display = 'card-body w-100 h-100 mx-0 d-none'
    div.className = 'card-body w-100 h-100 mx-0 d-flex flex-column align-items-center justify-content-center'
}
const logindiv = document.querySelector("#card_login")
const creatediv = document.querySelector("#card_criar")
const btn = document.querySelector("#btn1")
const btn2 = document.querySelector("#btn2")
const btn3 = document.querySelector("#btn3")
const btn4 = document.querySelector("#btn4")
const login = document.querySelector("#j5")
const senha = document.querySelector("#j6")
const nome = document.querySelector("#j7")
const cpf = document.querySelector("#j8")
const email = document.querySelector("#j9")
const senha2 = document.querySelector("#j10")
btn.addEventListener("click", () => {
    creatediv.style.display = 'block'
    j1galaxy.style.display = 'none'
})
btn2.addEventListener("click", () => {
    logindiv.style.display = 'block'
    j1galaxy.style.display = 'none'
})

btn3.addEventListener("click" ,() => {
    fetch('/login', {
        method: 'POST',
        body: JSON.stringify({
            login: login.value, 
            senha: senha.value
        }),
        headers: {'content-type': 'application/json'}
    }).then(res => {
            if (res.ok) {
            alert('usuário criado com sucesso!')
            document.location.href = '/'
        } else {
            res.text().then(obj => {alert(obj)})
        }
    })
})

btn4.addEventListener('click', () => {
    fetch('/criar', {
        method: 'POST',
        body: JSON.stringify({
            nome: nome.value,
            email: email.value,
            cpf: parseInt(cpf.value),
            senha: senha2.value
        }),
        headers: {'content-type': 'application/json'}
    }).then(res => {
        if (res.ok) {
            alert('usuário criado com sucesso!')
            document.location.href = '/'
        } else {
            res.text().then(obj => {alert(obj)})
        }
    })
})
