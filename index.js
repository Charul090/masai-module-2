import {displayPages,current_page} from './pagination.js'

window.addEventListener("load",()=>{
    let table=document.querySelector("#main-table");
    table.classList.add("d-none");
    changeDisplay(current_page,"start");
});

let coin=id();

let currency=document.querySelector("#currency");
let order=document.querySelector("#order");
let pages=document.querySelector("#per-page");

order.addEventListener("change",()=>{
    changeDisplay(current_page,"change");
})
pages.addEventListener("change",()=>{
    changeDisplay(current_page,"change");
})
currency.addEventListener("change",()=>{
    changeDisplay(current_page,"change");
})

export function changeDisplay(page,status){
    if(currency.value !== ""){
        let x=currency.value;
        let y=document.querySelector("#order").value;
        let z=document.querySelector("#per-page").value;
    
        let table=document.querySelector("#main-table");
        table.classList.add("d-none");

        let warning=document.querySelector("#warning");

        if(status === "start"){
            warning.classList.add("d-none");
        }
    
        getInfo(x,y,z,page,status)
    }
}


function getInfo(curr,order,pages,page,status){
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

    let pagi=document.querySelector("#display-pagination");
    pagi.innerHTML="";

    fetch(url.href)
    .then((res)=>res.json())
    .then((data)=>{
        spinner.classList.toggle("d-flex");
        spinner.classList.toggle("d-none");
        renderData(data);

        displayPages(page,status)
        
    })
}


function renderData(data){
    coin.clearIds();

    let table=document.querySelector("#main-table");
    table.classList.remove("d-none");

    data.forEach(element => {
        coin.setId(element["id"]);
        displayTable(element);
    });
    
}

function displayTable(obj){
    let row=document.createElement("tr");

    let rank=document.createElement("td");
    let name=document.createElement("td");
    let name_link=document.createElement("a");
    let sym=document.createElement("td")
    let price=document.createElement("td");
    let high=document.createElement("td");
    let low=document.createElement("td");
    let change=document.createElement("td");

    name_link.textContent=obj["name"];
    name_link.setAttribute("href","#");
    name_link.classList.add("text-reset");
    name.append(name_link);

    rank.textContent=obj["market_cap_rank"];
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



let table=document.querySelector("#main-table");

table.addEventListener("click",function(event){
    event.preventDefault();

    let trows=document.querySelectorAll("#table-display > tr");
    let array=coin.getIds();

    if(event.target.parentNode.parentNode.nodeName === "TR"){
        let x=event.target.parentNode.parentNode;
        for(let i=0;i<trows.length;i++){
            if(trows[i] === x){
                localStorage.setItem("coin_id",JSON.stringify(array[i]));
            }
        }

        window.location.assign("coin.html")
    }
})