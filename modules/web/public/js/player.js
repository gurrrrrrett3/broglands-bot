const path = window.location.pathname

let id = path.split("/")[2]

let data = fetch(path + "/data").then((res) => res.json()).then((data) => {
  
    document.title = `${data.username} | Broglands Nation`

})