const btn = document.querySelector("#logoutbtn")
const nome = document.querySelector("#nome")
const email = document.querySelector("#email")
const cpf = document.querySelector("#cpf")
btn.addEventListener("click", () => {
    fetch('/deslogar').then(res => res.text()).then(obj => {
        alert(obj)
        document.location.href = '/create.html'
    })
})

fetch('/dados').then(res => res.text()).then(obj => {
    try {
    obj = JSON.parse(obj)
    nome.textContent = obj.nome,
    cpf.textContent = 'CPF: '+ obj.cpf,
    email.textContent = 'E-mail: '+obj.email
    } catch {
    console.log('ero')
    }
})

