const btn = document.querySelector("#btn_config")
const cartoes = [document.querySelector("#j5"), document.querySelector("#j6"), document.querySelector("#j7")]
const senha = document.querySelector("#j8")
btn.addEventListener('click', () => {
    let dados = []
    let main = [senha.value, dados]
    for (x of cartoes) {
        if (x.value) {
            dados.push({
                codigo: x.value,
                numero: cartoes.indexOf(x) + 1
            })
        }
    }
    console.log(dados)
    fetch('/cartao_config', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(main)
    }).then(res => res.text().then(obj => {
        alert(obj)
        if (res.ok) {
            document.location.href = '/cartoes.html'  
        }
    }))
})