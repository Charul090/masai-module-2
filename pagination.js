import {changeDisplay} from './index.js';

let total=150;
export let current_page=1;
let current_set;

export function displayPages(page,status){
    if(page%5 !== 0){
        current_set=page-(page%5-1);
    }
    else{
        current_set=page-4;
    }
    
    let display=document.querySelector("#display-pagination");
    
    let previous=document.createElement("li")
    if(current_set === 1){
        previous.classList.add("page-item","disabled");
    }

    let previous_link=document.createElement("a");
    previous_link.classList.add("page-link");
    previous_link.setAttribute("href","#");
    previous_link.setAttribute("id",`li-prev`)

    let previous_span=document.createElement("span");
    previous_span.textContent="\u00AB";

    previous_link.append(previous_span);
    previous.append(previous_link);

    display.append(previous);

    for(let i=current_set;i<current_set+5;i++){
        let list=document.createElement("li");
        list.classList.add("page-item");

        if(page === i){
            list.classList.add("active");
        }

        let link=document.createElement("a");
        link.classList.add("page-link");
        link.setAttribute("href","#");
        link.textContent=`${i}`;
        link.setAttribute("id",`li${i}`);

        list.append(link);
        display.append(list);
    }

    let next=document.createElement("li")
    next.classList.add("page-item");

    let next_link=document.createElement("a");
    next_link.classList.add("page-link");
    next_link.setAttribute("href","#");
    next_link.setAttribute("id",`li-next`)

    let next_span=document.createElement("span");
    next_span.textContent="\u00BB";

    next_link.append(next_span);
    next.append(next_link);

    display.append(next);

    if(status === "start"){
        display.addEventListener("click",(e)=>{
            e.preventDefault();
            
            if(e.target.nodeName === "A" && e.target.id !== "li-prev" && e.target.id !== "li-next"){
                changePage(e.target.textContent)
            }
            else{
                if(e.target.id === "li-next" || e.target.textContent === "\u00BB"){
                    nextPage(e.target.textContent)
                }
                else if(e.target.id === "li-prev" || e.target.textContent === "\u00AB"){
                    previousPage(e.target.textContent)
                }
            }
        })
    }
}


function changePage(num){
    num = Number(num);
    
    let current = document.querySelector(`#li${current_page}`);
    

    if(current){
        current.classList.toggle("active");
    }    

    current_page=num;
    changeDisplay(current_page,"change");
    
}


function nextPage(num){
    num=+num;

    let pages=document.querySelectorAll("#display-pagination > li > a");
    let prev=document.querySelectorAll("#display-pagination > li");

    if(pages[1].textContent == 150){
        prev[6].classList.add("disabled")
    }
    else{
        if(current_page % 5 === 0){
            for(let i=1;i<pages.length-1;i++){
                if(i !== 0 || i !== 6){
                    let page = pages[i].textContent;
                    page= Number(page)+5;
                    pages[i].textContent=page;
        
                    if(prev[i].classList.contains("active")){
                        prev[i].classList.remove("active")
                    }
                    
                    if(pages[i].textContent == current_page){
                        prev[i].classList.add("active")
                    }
                    pages[i].setAttribute("id",`li${page}`)
                }
            }

            changePage(current_page+1);
        }

        else{
            changePage(current_page+1);
        }
    }
    if(pages[1].textContent != 1){
        prev[0].classList.remove("disabled")
    } 

    if(pages[1].textContent == 150){
        prev[6].classList.add("disabled")
    }
}

function previousPage(num){
    num=+num;

    let pages=document.querySelectorAll("#display-pagination > li > a");
    let prev=document.querySelectorAll("#display-pagination > li");

    if(pages[1].textContent == 1){
        prev[0].classList.add("disabled")
    }
    else{
        if(current_page % 5 === 0){
            for(let i=1;i<pages.length-1;i++){
                if(i !== 0 || i !== 6){
                    let page = pages[i].textContent;
                    page= Number(page)-5;
                    pages[i].textContent=page;
        
                    if(prev[i].classList.contains("active")){
                        prev[i].classList.remove("active")
                    }
                    
                    if(pages[i].textContent == current_page){
                        prev[i].classList.add("active")
                    }
                    pages[i].setAttribute("id",`li${page}`)
                }
            }

            changePage(current_page-1);
        }

        else{
            changePage(current_page-1)
        }
    }

    if(pages[1].textContent != 150){
        prev[6].classList.remove("disabled")
    }

    if(pages[1].textContent == 1){
        prev[0].classList.add("disabled")
    }
    
}