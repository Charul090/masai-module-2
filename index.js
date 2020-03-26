window.addEventListener("load",()=>{
    let table=document.querySelector("#main-table");
    table.classList.add("d-none")
});

let coin=id();

let currency=document.querySelector("#currency");

currency.addEventListener("change",function(){
    let x=currency.value;
    let y=document.querySelector("#order").value;
    let z=document.querySelector("#per-page").value;

    getInfo(x,y,z)
})



function getInfo(curr,order,pages){
    let url=new URL("https://api.coingecko.com/api/v3/coins/markets");
    let params=new URLSearchParams();
    params.set("vs_currency",curr);
    params.set("order",order);
    params.set("per_page",pages);

    url.search=params.toString();

    let spinner=document.querySelector("#display-spinner");
    spinner.classList.remove("d-none");
    spinner.classList.add("d-flex")

    fetch(url.href)
    .then((res)=>res.json())
    .then((data)=>{
        spinner.classList.toggle("d-flex");
        spinner.classList.toggle("d-none");
        renderData(data);
    })
}


function renderData(data){
    coin.clearIds();

    let table=document.querySelector("#main-table");
    table.classList.toggle("d-none");

    let display=document.querySelector("#table-display");
    display.innerHTML="";

    displayTable(data[0]);
}

function displayTable(obj){
    let row=document.createElement("tr");

    let rank=document.createElement("td");
    let name=document.createElement("td");
    let price=document.createElement("td");
    let high=document.createElement("td");
    let low=document.createElement("td");
    let change=document.createElement("td");

    rank.textContent=obj["market_cap_rank"];
    name.textContent=obj["name"]
    price.textContent=obj["current_price"];

    let display=document.querySelector("#table-display");

    row.append(rank,name,price);

    display.append(row);
    console.log(obj)
}


function id(){
    let ids=[];
    function setId(value){
        ids.push(value);
    }

    function getIds(){
        return ids;
    }

    function clearIds(){
        ids.length=0;
    }

    return {setId,getIds,clearIds};
}