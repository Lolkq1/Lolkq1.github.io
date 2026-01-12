// let card = document.createElement('div')
// card.className = 'card w-25 m-2'
// let card2 = document.createElement('div')
// card2.className = 'card-body'
// let r = document.createElement('div')
// r.className = 'row'
// let column1 = document.createElement('div')
// column1.className = 'col-6'
// let column2 = document.createElement('div')
// column2.className = 'col-6'
// let imgcard = document.createElement('img')
// imgcard.className = 'card-image w-100'
// imgcard.src = 'credit-card.jpg'
// let p1 = document.createElement('p')
// p1.textContent = 'Número: '
// p1.className = 'card-text'
// let p2 = document.createElement('p')
// p2.textContent = 'Saldo: '
// p2.className = 'card-text'
// let btn = document.createElement('button')
// btn.className = 'btn btn-primary'
// btn.textContent = 'Ver extrato'
// let main_r = document.querySelector("#main")
// main_r.appendChild(card)
// card.appendChild(card2)
// card2.appendChild(r)
// r.appendChild(column1)
// r.appendChild(column2)
// column1.appendChild(imgcard)
// column2.appendChild(p1)
// column2.appendChild(p2)
// column2.appendChild(btn)
// criei isso dai em cima no console do google ta salvo p dps eu configurar




    fetch('/get_cartoes', {
        credentials: "include"
    }).then(res => res.text()).then(obj => JSON.parse(obj)).then(obj2 => {
        const main_r = document.querySelector("#main")
        for (let x of obj2) {
            let card = document.createElement('div')
            card.className = 'card w-25 m-2'
            let card2 = document.createElement('div')
            card2.className = 'card-body'
            let r = document.createElement('div')
            r.className = 'row'
            let column1 = document.createElement('div')
            column1.className = 'col-6'
            let column2 = document.createElement('div')
            column2.className = 'col-6'
            let imgcard = document.createElement('img')
            imgcard.className = 'card-image w-100'
            imgcard.src = 'credit-card.jpg'
            let p1 = document.createElement('p')
            p1.textContent = 'Número: '+ x.numero
            p1.className = 'card-text'
            let p2 = document.createElement('p')
            p2.textContent = 'Saldo: R$'+ x.saldo
            p2.className = 'card-text'
            let btn = document.createElement('button')
            btn.className = 'btn btn-primary'
            btn.textContent = 'Realizar transferência'
            btn.addEventListener("click", () => {
                document.location.href='/transacao.html?cartao='+x.numero
            })
            main_r.appendChild(card)
            card.appendChild(card2)
            card2.appendChild(r)
            r.appendChild(column1)
            r.appendChild(column2)
            column1.appendChild(imgcard)
            column2.appendChild(p1)
            column2.appendChild(p2)
            column2.appendChild(btn)
        }
    })