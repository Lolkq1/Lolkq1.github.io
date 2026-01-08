const btn = document.querySelector("#logoutbtn")

btn.addEventListener("click", () => {
    fetch('/deslogar', {
        credentials: "include"
    }).then(res => res.text()).then(obj => {
        alert(obj)
        document.location.href = '/create.html'
    })
})