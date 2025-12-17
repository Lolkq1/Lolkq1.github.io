const nome = document.querySelector("#nome")
const codigo = document.querySelector("#codigo")
const btn = document.querySelector("#btn")
const admq = localStorage.getItem('adm')
const sessionT = localStorage.getItem('sessionToken')
switch (admq) {
    case '1':
        console.log('um')
        fetch('/veradmin', {
            method: 'POST',
            body: sessionT
        }).then(res => {
            if (res.ok) {
                rodar()
            } else {
                res.text().then(obj => alert(obj))
                localStorage.setItem('adm', 0)
                location.href='http://localhost:8080/telaInicial.html'
            }
        })
    break;
    case '0':
        location.href='http://localhost:8080/telaInicial.html'
    break;
    default:
        location.href='http://localhost:8080/telaInicial.html'
    break
}

function rodar() {

btn.addEventListener("click", () => {
    fetch('/criar_adm', {
        method: 'POST',
        body: JSON.stringify({
            codigo: codigo.value,
            nome: nome.value
        })
    }).then(res => {
        if (res.ok) {
            alert('candidato inserido com sucesso no sistema!')
        } else {
            res.text().then(obj => {alert(obj)})
        }
    })
})
}