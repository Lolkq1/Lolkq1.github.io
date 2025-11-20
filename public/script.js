const btn = document.querySelector("#btn")
const t = document.querySelector("#t")
const re = document.querySelector("#re")
btn.addEventListener("click", () => {
    fetch('/santos', {
        method: 'POST',
        body: JSON.stringify({
            mundial: t.value
        })
    }).then(obj => obj.text()).then(res => {
        re.textContent = res
    })
})

let t2 = ''
    let c2 = document.cookie.split(';')
    let c3 = []
    for (x in c2) {
        c3.push(c2[x].split('='))
    }
    let a = 0
    for (x in c3) {
            if (c3[0][x] === 'teste') {
                a=parseInt(x+1)
            }
        }
    t2 = c3[0][a]
re.textContent = t2