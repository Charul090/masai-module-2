function loadGraph(status){
    let data=getData()

    data.then((res)=>{
        renderChart(res,status)
    });
}

window.addEventListener("load",()=>{
    loadGraph("load");
});

let currency=document.querySelector("#currency");

currency.addEventListener("change",()=>{
    loadGraph("change");
})


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
                pointBackgroundColor:"#FF1744",
                fill:false
            }]
        },
        options:{
            legend:{
                display:false
            },
            scales:{
                xAxes:[{
                    ticks:{
                        fontColor:"white",
                        fontSize:10,
                    },
                    gridLines:{
                        zeroLineColor:"white"
                    }
                }],
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
                        color:"white"
                    }
                    
                }]
            } 
        }

    })
}

