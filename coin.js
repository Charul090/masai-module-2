function loadGraph(status){
    let data=getData()

    data.then((res)=>{
        renderChart(res,status)
    });
}

window.addEventListener("load",()=>{
    loadGraph("load");
    getInfo();
});

let currency=document.querySelector("#currency");

currency.addEventListener("change",()=>{
    loadGraph("change");
    displayPrices();
});

let current_prices;


async function getData(){
    let id = localStorage.getItem("coin_id");
    let currency=document.querySelector("#currency");
    
    let url=new URL(`https://api.coingecko.com/api/v3/coins/${JSON.parse(id)}/market_chart`);

    let params=new URLSearchParams();
    params.set("vs_currency",currency.value);
    params.set("days",91);

    url.search=params.toString();

    let info;
    

    try {
        info = await fetch(url.href,{
        methd:"GET" 
        })
        .then((res)=>res.json())
        .then((data)=>{
            let prices =[];
            let timestamp=[];
            
            for(let i=0;i<data["prices"].length;i++){
                prices[i]=data["prices"][i][1].toFixed(2);
                let d= new Date(data["prices"][i][0]);
                timestamp[i]=`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
            }
            return {prices,timestamp}
        });
    }
    catch(e){
        console.log("Error status:"+e);
    }

    return info;

}

var myChart

function renderChart(data,status){
    let sign;

    if(status === "change"){
        myChart.destroy();
    }

    switch(currency.value){
        case "usd":
            sign="$";
            break;
        case "eur":
            sign="€";
            break;
        case "jpy":
            sign="¥";
            break;
        case "inr":
            sign="₹";
            break;
    }

    let ctx = document.getElementById('myChart').getContext("2d");
    myChart = new Chart(ctx,{
        type:"line",
        data:{
            labels:data["timestamp"],
            datasets:[{
                data:data["prices"],
                borderColor:"#6200EA",
                pointBackgroundColor:"#F50057",
                fill:false
            }]
        },
        options:{
            legend:{
                display:false
            },
            scales:{
                yAxes:[{
                    ticks:{
                        fontColor:"white",
                        fontSize:15,
                        padding:1,
                        callback: function(value, index, values) {
                            return sign + value;
                        }
                    },
                    gridLines:{
                        color:"#212121"
                    }
                    
                }],
                xAxes:[{
                    ticks:{
                        fontColor:"white",
                        fontSize:10,
                    },
                    gridLines:{
                        zeroLineColor:"#616161"
                    }
                }]
            } 
        }

    })
}

function getInfo(){
    let id = JSON.parse(localStorage.getItem("coin_id"));

    let url=new URL(`https://api.coingecko.com/api/v3/coins/${id}`);

    let params=new URLSearchParams();
    params.set("market_data",true);
    params.set("tickers",false)
    params.set("localization",false)
    params.set("community_data",false)
    params.set("developer_data",false)
    url.search=params.toString();

    fetch(url.href)
    .then((res)=>res.json())
    .then((data)=>{
        renderUI(data);
    })
}


function renderUI(data){
    let src=data["image"]["small"];

    current_prices=data["market_data"];

    let image=document.querySelector("#coin-title > img");
    image.setAttribute("src",src);

    let title=document.querySelector("#coin-title > h1");
    title.textContent=data["name"];

    displayStats(data);

    displayInfo(data);   
}


function displayStats(data){
    let display=document.querySelector("#coin-list");

    let desc_titles=[];
    let desc_details=[];

    desc_titles.push("Symbol");
    desc_details.push(data["symbol"]);

    desc_titles.push("Genesis Date");
    desc_details.push(data["genesis_date"]);

    desc_titles.push("Market Cap Rank");
    desc_details.push(data["market_cap_rank"]);

    desc_titles.push("Coin Gecko Rank");
    desc_details.push(data["coingecko_rank"]);

    desc_titles.push("Coin Gecko Score");
    desc_details.push(data["coingecko_score"]);

    desc_titles.push("\uD83D\uDC4D");
    desc_details.push(data["sentiment_votes_up_percentage"]+"%");

    desc_titles.push("\uD83D\uDC4E");
    desc_details.push(data["sentiment_votes_down_percentage"]+"%");

    for(let i=0;i<desc_titles.length;i++){
        let title=document.createElement("dt");
        let details=document.createElement("dd");

        title.classList.add("col-sm-5");
        details.classList.add("col-sm-7")

        title.textContent=desc_titles[i];
        details.textContent=desc_details[i];

        display.append(title,details);
    }
}

function displayInfo(data){
    let tab=document.querySelector("#info-tab")
    let container = document.querySelector("#info-content");

    displayPrices();

    setPriceColor();

    displayDesc(data);

    displaySocial(data)

    container.classList.remove("d-none");
    tab.classList.remove("d-none");
}



function displayPrices(){
    let sign;

    let currency=document.querySelector("#currency");

    switch(currency.value){
        case "usd":
            sign="$";
            break;
        case "eur":
            sign="€";
            break;
        case "jpy":
            sign="¥";
            break;
        case "inr":
            sign="₹";
            break;
    }

    let price=document.querySelector("#value");
    price.textContent=`Price: ${sign}${current_prices["current_price"][currency.value]}`;

    let low=document.querySelector("#low");
    low.textContent=`Price Low 24h: ${sign}${current_prices["low_24h"][currency.value]}`;

    let high=document.querySelector("#high");
    high.textContent=`Price High 24h: ${sign}${current_prices["high_24h"][currency.value]}`

    let cap=document.querySelector("#mar-cap");
    cap.textContent=`Market Cap: ${sign}${current_prices["market_cap"][currency.value]}`

    let cap_change=document.querySelector("#cap-change");
    let status=document.createElement("span")
    cap_change.textContent=`Market Cap Change(24h): `;
    status.textContent=`${current_prices["market_cap_change_percentage_24h_in_currency"][currency.value].toFixed(2)}%`

    if(current_prices["market_cap_change_percentage_24h_in_currency"][currency.value] < 0){
        status.classList.add("text-danger");
    }
    else{
        status.classList.add("text-success")
    }

    cap_change.append(status)
}



function setPriceColor(){
    let change_24=document.querySelector("#change-24");
    let change_7=document.querySelector("#change-7")
    let change_30=document.querySelector("#change-30")
    let change_200=document.querySelector("#change-200")
    let change_1=document.querySelector("#change-1");

    let status_24=document.createElement("span");
    status_24.textContent = `${current_prices["price_change_percentage_24h"].toFixed(2)}%`;

    if(current_prices["price_change_percentage_24h"] < 0){
        status_24.classList.add("text-danger");    
    }
    else{
        status_24.classList.add("text-success");
    }
    change_24.textContent=`Change in 24h: `
    change_24.append(status_24);


    let status7 = document.createElement("span");
    status7.textContent = `${current_prices["price_change_percentage_7d"].toFixed(2)}%`;

    if(current_prices["price_change_percentage_7d"] < 0){
        status7.classList.add("text-danger");    
    }
    else{
        status7.classList.add("text-success");
    }
    change_7.textContent=`Change in 7d: `
    change_7.append(status7);


    let status_30 = document.createElement("span");
    status_30.textContent = `${current_prices["price_change_percentage_30d"].toFixed(2)}%`;

    if(current_prices["price_change_percentage_30d"] < 0){
        status_30.classList.add("text-danger");    
    }
    else{
        status_30.classList.add("text-success");
    }
    change_30.textContent=`Change in 7d: `
    change_30.append(status_30);




    let status_200 = document.createElement("span");
    status_200.textContent = `${current_prices["price_change_percentage_200d"].toFixed(2)}%`;

    if(current_prices["price_change_percentage_200d"] < 0){
        status_200.classList.add("text-danger");    
    }
    else{
        status_200.classList.add("text-success");
    }
    change_200.textContent=`Change in 200d: `
    change_200.append(status_200);





    let status_1 = document.createElement("span");
    status_1.textContent = `${current_prices["price_change_percentage_1y"].toFixed(2)}%`;

    if(current_prices["price_change_percentage_1y"] < 0){
        status_1.classList.add("text-danger");    
    }
    else{
        status_1.classList.add("text-success");
    }
    change_1.textContent=`Change in 1y: `
    change_1.append(status_1);
}



function displayDesc(data){
    let display=document.querySelector("#desc-content");

    let para=document.createElement("p");
    para.innerHTML=data["description"]["en"];

    display.append(para)
}



function displaySocial(data){

    let display=document.querySelector("#social-content");

    console.log(data);

    let homepage=document.createElement("p");
    let link=document.createElement("a");
    link.setAttribute("href",data["links"]["homepage"][0]);
    link.textContent="HOMEPAGE";
    homepage.append(link);

    let forum=document.createElement("p");
    let flink=document.createElement("a");
    flink.setAttribute("href",data["links"]["official_forum_url"][0]);
    flink.textContent="Official Forum";
    forum.append(flink);

    let reddit=document.createElement("p");
    let rlink=document.createElement("a");
    rlink.setAttribute("href",data["links"]["subreddit_url"]);
    rlink.textContent="Official Subreddit";
    reddit.append(rlink);

    display.append(homepage,forum,reddit);

    let main_display=document.querySelector("#main-display");
    main_display.classList.remove("d-none");
}