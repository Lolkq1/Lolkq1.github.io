const btn = document.querySelector("#btn_registrar")
const j5 = document.querySelector("#j5")
const j6 = document.querySelector("#j6")
btn.addEventListener('click', () => {
    fetch('/criar_cartao', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            senha_cartao: j5.value,
            senha_usuario: j6.value
        })
    }).then(res => res.text().then(obj => {
        alert(obj)
        if (res.ok) {
            document.location.href = '/cartoes.html'
        }
    }))
})