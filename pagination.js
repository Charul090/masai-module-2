import {changeDisplay} from './index.js';

let total=150;
export let current_page=1;

export function displayPages(page){
    current_page=page;
    let display=document.querySelector("#display-pagination");
    
    let previous=document.createElement("li")
    previous.classList.add("page-item","disabled");
    previous.setAttribute("id",`li-prev`)

    let previous_link=document.createElement("a");
    previous_link.classList.add("page-link");
    previous_link.setAttribute("href","#");

    let previous_span=document.createElement("span");
    previous_span.textContent="\u00AB";

    previous_link.append(previous_span);
    previous.append(previous_link);

    display.append(previous);

    for(let i=0;i<5;i++){
        let list=document.createElement("li");
        list.classList.add("page-item");
        list.setAttribute("id",`li${i+1}`);

        if(page === (i+1)){
            list.classList.add("active");
        }

        let link=document.createElement("a");
        link.classList.add("page-link");
        link.setAttribute("href","#");
        link.textContent=`${i+1}`;

        list.append(link);
        display.append(list);
    }

    let next=document.createElement("li")
    next.classList.add("page-item");
    next.setAttribute("id",`li-next`)

    let next_link=document.createElement("a");
    next_link.classList.add("page-link");
    next_link.setAttribute("href","#");

    let next_span=document.createElement("span");
    next_span.textContent="\u00BB";

    next_link.append(next_span);
    next.append(next_link);

    display.append(next);


    display.addEventListener("click",(e)=>{
        e.preventDefault();
        
        if(e.target.nodeName === "A"){
            changePage(e.target.textContent)
        }
    })
}


function changePage(num){
    num = Number(num);
    
    let current = document.querySelector(`#li${current_page}`);
    let next=document.querySelector(`#li${num}`);

    current.classList.toggle("active");
    next.classList.toggle("active");

    current_page=num;
    changeDisplay(current_page);
}