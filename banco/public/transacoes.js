fetch('/get_transacoes', {
    credentials: "include"
}).then(res => {
    if (res.ok) {
        res.text().then(res2=> {
    // esperar receber um array com todas as transacoes.
            const table = document.querySelector("#table")
            for (x in res2) {
                let t1 = document.createElement('tr')
                    let t2 = document.createElement('td')
                        let t3 = document.createElement('td')
                            let t4 = document.createElement('td')
                                let t5 = document.createElement('td')

                                    t2.textContent = res2[x].ID
                                        t3.textContent = res2[x].nome 
                                        t4.textContent = res2[x].quantia
                                    t5.textContent = res2[x].data

                                table.appendChild(t1)
                            t1.appendChild(t2)
                        t1.appendChild(t3)
                    t1.appendChild(t4)
                t1.appendChild(t5)
            }
        })
    } else {
        return res.status(500).send('erro.')
    }
})