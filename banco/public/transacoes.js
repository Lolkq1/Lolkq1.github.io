fetch('/get_transacoes').then(res => {
    if (res.ok) {
        res.text().then(obj=> 
    // esperar receber um array com todas as transacoes.
            JSON.parse(obj)
        ).then(res2 => {
            const table = document.querySelector("#table")
            console.log(res2)
            for (x in res2) {
                let t1 = document.createElement('tr')
                    let t2 = document.createElement('td')
                        let t3 = document.createElement('td')
                            let t4 = document.createElement('td')
                                let t5 = document.createElement('td')
                                    let t6 = document.createElement('td')
                                        t2.textContent = res2[x].ID
                                            t3.textContent = res2[x].des_nome
                                            t4.textContent = 'R$'+res2[x].quantia
                                        t5.textContent = res2[x].data
                                    t6.textContent = res2[x].dir
                                table.appendChild(t1)
                            t1.appendChild(t2)
                        t1.appendChild(t3)
                    t1.appendChild(t4)
                t1.appendChild(t5)
                    t1.appendChild(t6)
            }
        })
    } else {
        return res.status(500).send('erro.')
    }
})