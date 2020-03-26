window.addEventListener("load",()=>{
    let table=document.querySelector("#main-table");
    table.classList.add("d-none")
});

let coin=id();

let currency=document.querySelector("#currency");
let order=document.querySelector("#order");
let pages=document.querySelector("#per-page");

order.addEventListener("change",changeDisplay)
pages.addEventListener("change",changeDisplay)
currency.addEventListener("change",changeDisplay)

function changeDisplay(){
    if(currency.value !== ""){
        let x=currency.value;
        let y=document.querySelector("#order").value;
        let z=document.querySelector("#per-page").value;
    
        let table=document.querySelector("#main-table");
        table.classList.add("d-none");
    
        getInfo(x,y,z,1)
    }
}


function getInfo(curr,order,pages,page){
    let url=new URL("https://api.coingecko.com/api/v3/coins/markets");
    let params=new URLSearchParams();
    params.set("vs_currency",curr);
    params.set("order",order);
    params.set("per_page",pages);
    params.set("page",page)

    url.search=params.toString();

    let display=document.querySelector("#table-display");
    display.innerHTML="";

    let spinner=document.querySelector("#display-spinner");
    spinner.classList.remove("d-none");
    spinner.classList.add("d-flex");

    console.log(url.href)

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
    table.classList.remove("d-none");

    data.forEach(element => {
        displayTable(element);
    });
    
}

function displayTable(obj){
    let row=document.createElement("tr");

    let rank=document.createElement("td");
    let name=document.createElement("td");
    let sym=document.createElement("td")
    let price=document.createElement("td");
    let high=document.createElement("td");
    let low=document.createElement("td");
    let change=document.createElement("td");

    rank.textContent=obj["market_cap_rank"];
    name.textContent=obj["name"]
    sym.textContent=obj["symbol"]
    price.textContent=obj["current_price"];
    high.textContent=obj["high_24h"];
    low.textContent=obj["low_24h"];
    change.textContent=obj["market_cap_change_percentage_24h"];

    let status=document.createElement("span");
    if(obj["market_cap_change_percentage_24h"] > 0){ 
        status.textContent="\u2191";
        status.classList.add("text-success","lead")
        change.append(status)
    }
    else if(obj["market_cap_change_percentage_24h"] < 0){
        status.textContent="\u2193";
        status.classList.add("text-danger","lead");
        change.append(status)
    }

    let display=document.querySelector("#table-display");

    row.append(rank,name,sym,price,high,low,change);

    display.append(row);
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