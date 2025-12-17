console.log(localStorage.getItem('adm'))
const mainDiv = document.querySelector("#mainDiv")
const createDiv = document.querySelector("#createDiv")
const loginDiv = document.querySelector("#loginDiv")
const adminDiv = document.querySelector("#adminDiv")
const btn1 = document.querySelector("#btn1")
const btn2 = document.querySelector("#btn2")
const btn3 = document.querySelector("#btn3")

let sessionT = localStorage.getItem('sessionToken')
let admq = localStorage.getItem('adm')
console.log(admq)
function analiseNormal() {
    switch (sessionT) {
    case 'undefined':
        rodar()
        break
    case ' ':
        rodar()
        break
    default:
        fetch('/ver', {
        method:'POST',
        body:sessionT
        }).then(res => {
        if (res.ok) {
            res.text().then(obj => JSON.parse(obj)).then(obj2 => {
                if (obj2.length === 0) {
                    rodar()
                } else {
                    document.location.href = 'http://localhost:8080/'
                }
            })
        } else {
            alert('um erro inesperado ocorreu: tente entrar em sua conta novamente.')
            localStorage.setItem('sessionToken', undefined)
            rodar()
        }
    })
}
}
switch (admq) {
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
                analiseNormal()
            }
        })
    break;
    case '0':
        console.log('zero')
        analiseNormal()
    break;
    default:
        console.log('nada ve ze')
        analiseNormal()
    break
}

// if (sessionT === undefined) {
//     rodar()
// } else {
//     fetch('/ver', {
//         method:'POST',
//         body:sessionT
//     }).then(res => {
//         if (res.ok) {
//             res.text().then(obj => JSON.parse(obj)).then(obj2 => {
//                 if (obj2.length === 0) {
//                     rodar()
//                 } else {
//                     document.location.href = 'http://localhost:8080/'
//                 }
//             })
//         } else {
//             alert('um erro inesperado ocorreu: tente entrar em sua conta novamente.')
            
//         }
//     })
// }

function rodar() {
    function switchTabs(div) {
    // pode nao funcionar por conta da prioridade ja q ta pegando por tag mas jaé
    let divs = document.querySelectorAll("div")
    div.style.display = 'inline'
    for (x in divs) {
        if (divs[x] !== div) {
            divs[x].style.display = 'none'
        }
    }
}


btn1.addEventListener("click", () => {
    switchTabs(createDiv)
})

btn2.addEventListener("click", () => {
    switchTabs(loginDiv)
})

btn3.addEventListener("click", () => {
    switchTabs(adminDiv)
})

const voltar = document.querySelector(".voltar")

const btnCriar = document.querySelector("#enois")
const btnLogin = document.querySelector("#enois2")
const btnADM = document.querySelector("#enois3")

const nome = document.querySelector("#nome")
const resenha1 = document.querySelector("#resenha1")
const resenha2 = document.querySelector("#resenha2")
console.log('teset')

voltar.addEventListener("click", () => {
    switchTabs(mainDiv)
})
btnCriar.addEventListener("click", () => {
    fetch("/criar", {
        method: 'POST',
        body: JSON.stringify({
            nome: nome.value,
            email: resenha1.value,
            senha: resenha2.value
        })
    }).then(res => {
        if (res.ok) {
            res.text().then(ney => {
                localStorage.setItem('sessionToken', ney)
                document.location.href = 'http://localhost:8080/'
            })
        } else {
            res.text().then(ney => alert(ney))
        }
    })
})

const email = document.querySelector("#email")
const senha = document.querySelector("#senha")

btnLogin.addEventListener("click", () => {
    fetch('/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            senha: senha.value
        })
    }).then(res => {
        if (res.ok) {
            res.text().then(santos2012 => {
                localStorage.setItem('sessionToken', santos2012)
                document.location.href='http://localhost:8080/'
            })
        } else {
            res.text().then(neymaaaar => alert(neymaaaar))
        }
    })
})

const email2 = document.querySelector("#email2")
const senha2 = document.querySelector("#senha2")

btnADM.addEventListener("click", () => {
    fetch('/adm', {
        method: 'POST',
        body: JSON.stringify({
            email: email2.value,
            senha: senha2.value
        })
    }).then(res => {
        if (res.ok) {
            res.text().then(santos2012 => {
                localStorage.setItem('sessionToken', santos2012)
                localStorage.setItem('adm', 1)
                document.location.href='http://localhost:8080/telaAdmin.html'
            })
        } else {
            res.text().then(neymaaaar => alert(neymaaaar))
        }
    })
})
}