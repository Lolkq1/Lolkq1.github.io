const btn = document.querySelector("#btn_transferencia")
const chave = document.querySelector("#j5")
const quantia = document.querySelector("#j6")
const senha = document.querySelector("#j7")
const cartao = document.querySelector("#j1")
let url = document.location.toString()
let c = parseInt(url.slice(url.indexOf('?cartao=')+8, url.length))
btn.addEventListener("click", () => {
    fetch('/transacao', {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify(
            {
                rem: {
                    numero: c
                },
                senha: senha.value,
                quantia: quantia.value,
                des: {
                    cartao:"0" + cartao.value,
                    chave: chave.value 
                }
            }
        )
    }).then(res => res.text().then(obj => {
        alert(obj)
        if (res.ok) {
            location.href='/transacoes.html'
        }
    }))
})