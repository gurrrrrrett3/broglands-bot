const table = document.getElementById("table");

const createTableElement = (data) => {
  const tr = document.createElement("tr");
  const td1 = document.createElement("td");
  const td2 = document.createElement("td");
  const td3 = document.createElement("td");
  const td4 = document.createElement("td");

  td1.innerHTML = data[1];
  td2.innerHTML = data[2];
  td3.innerHTML = data[3];
  td4.innerHTML = data[4];

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);

  tr.addEventListener("click", () => {
    window.location = data[5]
  });

  if (data[0]){
      tr.className = "table-active";
  }

  return tr;
};

const fetchTableData = () => {
  fetch("/api/table")
    .then((res) => res.json())
    .then((data) => {
        table.innerHTML = "";
      data.content.forEach((player) => {
        const tr = createTableElement(player);
        table.appendChild(tr);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const int = setInterval(fetchTableData, 5000);
document.addEventListener("DOMContentLoaded", fetchTableData);
