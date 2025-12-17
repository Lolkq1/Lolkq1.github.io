console.log(localStorage.getItem('adm'))
const btn = document.querySelector("#btn")
const vc = document.querySelector("#votos_candidato")
const votos_branco = document.querySelector("#votos_branco")
const candid = document.querySelector("#nome_candidato")
const divboletim = document.querySelector(".boletimdiv")
const divvoto = document.querySelector(".votediv")
const input = document.querySelector("#candidato")
const voltar = document.querySelector(".voltar")
let sessionT = localStorage.getItem('sessionToken')
let admq = localStorage.getItem('adm')
voltar.addEventListener("click", () => {
    localStorage.setItem('sessionToken', undefined)}
)

function resenha() {
    if (sessionT !== undefined) {
        fetch('/ver', {
            method: 'POST',
            body: sessionT
        }).then(res => {if (res.ok) {
            res.text().then(obj => JSON.parse(obj)).then(ooi => {
                console.log(ooi)
                localStorage.setItem('votou',ooi[0].votou)
                localStorage.setItem('codigo', ooi[0].codigo)
                        if (localStorage.getItem('votou') == 1) {
                        console.log(localStorage.getItem('votou'))
                    fetch('/cred', {
                        method:'POST',
                        body: localStorage.getItem('codigo')
                    }).then(res => {
                        if (res.ok) {
                            res.text().then(iae => JSON.parse(iae)).then(obj => {
                                console.log('iae')
                                document.body.removeChild(divvoto)
                                divboletim.style.display = 'inline'
                                votos_branco.textContent = 'votos em branco: '+obj.votos_branco
                                vc.textContent = 'votos do candidato: '+obj.votos
                                candid.textContent = 'candidato: '+obj.nome
                            })
                        } else {
                                console.log('deu erro')
                                alert('erro: o candidato no qual você votou não existe.')
                                }
                    }) } else {
                    //parte do voto
                    btn.addEventListener("click", () => {
                    if (input.value.length != 0 && input.value != " " && typeof parseInt(input.value) === "number") {
                        fetch('/voto', {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            codigo: input.value,
                            eleitor: localStorage.getItem('sessionToken')
                        }
                    )
                    }).then(res => {
                        if (res.ok) {
                            res.text().then(res2 => JSON.parse(res2)).then(obj => {
                                console.log(obj)
                                localStorage.setItem('votou', true)
                                localStorage.setItem('codigo', obj.codigo)
                                divvoto.style.display = 'none'
                                divboletim.style.display = 'inline'
                                votos_branco.textContent = 'votos em branco: '+obj.votos_branco
                                vc.textContent = 'votos do candidato: '+obj.votos
                                candid.textContent = 'candidato: '+obj.nome
                            })
                        } else {
                            res.text().then(res2 => alert(res2))
                        }
                    })
                    } else {
                        alert('digite um numero valido.')
                    }
            })
                    }
            })
            
        } else {
            document.location.href = 'http://localhost:8080/telaInicial.html'
        }

    })
    } else {
        document.location.href = 'http://localhost:8080/telaInicial.html'
    }
}

switch (admq) {
    case '0':
        console.log('zer')
        resenha()
    break;
    case '1':
        console.log('um')
        fetch('/veradmin', {
            method: 'POST',
            body: sessionT
        }).then(res => {
            if (res.ok) {
                location.href='http://localhost:8080/telaAdmin.html'
            } else {
                res.text().then(obj => alert(obj))
                localStorage.setItem('adm', 0)
                resenha()
            }
        }) 
    break;
    default:
        console.log('defaultio')
        resenha()
}




    
