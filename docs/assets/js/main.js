"use strict";const searchInput=document.querySelector(".js-search"),mainPage=document.querySelector(".js-main"),searchButton=document.querySelector(".js-search-button"),showsContainer=document.createElement("section"),searchListContainer=document.createElement("div"),favListContainer=document.createElement("aside"),searchList=document.createElement("ul"),favList=document.createElement("ul"),favElement=document.createElement("div"),favsWarning=document.createElement("p");showsContainer.setAttribute("class","main__shows"),searchListContainer.setAttribute("class","main__shows__search js-search-results"),favListContainer.setAttribute("class","main__shows__fav wrapper"),searchList.setAttribute("class","main__shows__search__results"),favList.setAttribute("class","main__shows__fav__results__ul"),mainPage.appendChild(showsContainer),showsContainer.appendChild(favListContainer),showsContainer.appendChild(searchListContainer);const tvIcon=document.createElement("div");tvIcon.setAttribute("class","main__shows__fav__tv  js-tv-icon"),favListContainer.appendChild(tvIcon);const tvFav=document.createElement("p"),tvImg=document.createElement("img"),tvButton=document.createElement("div");tvButton.setAttribute("class","main__shows__fav__tv__button js-favs-toggle"),tvImg.setAttribute("class","main__shows__fav__tv__img"),tvImg.setAttribute("src","./assets/images/tv.png"),tvIcon.appendChild(tvImg),tvIcon.appendChild(tvFav),tvIcon.appendChild(tvButton);const resetContainer=document.createElement("div"),resetImg=document.createElement("img"),resetButton=document.createElement("div");resetButton.setAttribute("class","js-button-reset main__shows__fav__reset__button "),resetImg.setAttribute("class","main__shows__fav__reset__img"),resetImg.setAttribute("src","./assets/images/trashcan.png");const reset=document.createTextNode("Reset Favorites");resetContainer.setAttribute("class","main__shows__fav__reset"),favListContainer.appendChild(resetContainer),resetButton.appendChild(reset),resetContainer.appendChild(resetImg),resetContainer.appendChild(resetButton);const errorSearch=document.createElement("p");errorSearch.setAttribute("class","js-error-message"),searchListContainer.appendChild(searchList),searchListContainer.appendChild(errorSearch),favElement.setAttribute("class","main__shows__fav__results js-fav-results"),favListContainer.appendChild(favElement),favElement.appendChild(favsWarning),favElement.appendChild(favList);let searchShows=[],favShows=[];const handleSearchButton=e=>{e.preventDefault(),resetSearch(),getShowsFromApi()},resetSearch=()=>{searchShows=[],searchList.innerHTML=""},getShowsFromApi=()=>{let e=searchInput.value;fetch("http://api.tvmaze.com/search/shows?q="+e).then(e=>e.json()).then(e=>{0===e.length?errorSearch.innerHTML="We can't find nothing, try again!":errorSearch.innerHTML="";for(const t of e)null!==t.show.image?searchShows.push({id:t.show.id,name:t.show.name,img:t.show.image.medium,fav:!1}):searchShows.push({id:t.show.id,name:t.show.name,img:"./assets/images/Cornelius.png",fav:!1});updateFavSearch(),paintShows()})},paintShows=()=>{searchList.innerHTML="";for(const e of searchShows){const t=document.createElement("li");searchList.appendChild(t),t.setAttribute("id",e.id),t.setAttribute("class","js-item"),!0===e.fav?t.classList.add("js-fav-item"):!1===e.fav&&t.classList.remove("js-fav-item");const s=document.createElement("h3");s.setAttribute("class","h3");const a=document.createTextNode(e.name);t.appendChild(s),s.appendChild(a);const n=document.createElement("div"),o=document.createElement("img");o.setAttribute("src",e.img),n.appendChild(o),t.appendChild(n),listenFavClicks()}};searchButton.addEventListener("click",handleSearchButton);const handleShowFav=e=>{const t=parseInt(e.currentTarget.id),s=searchShows.find(e=>e.id===t),a=favShows.find(e=>e.id===t);if(void 0===a)s.fav=!0,favShows.push(s);else{const e=favShows.indexOf(a);favShows.splice(e,1),s.fav=!1}updateFavSearch(),paintShows(),updateLocalStorage(),paintFavList()},listenFavClicks=()=>{const e=document.querySelectorAll(".js-item");for(let t=0;t<e.length;t++){e[t].addEventListener("click",handleShowFav)}},updateLocalStorage=()=>{localStorage.setItem("fav",JSON.stringify(favShows))},getFromLocalStorage=()=>{const e=JSON.parse(localStorage.getItem("fav"));null!==e&&(favShows=e),recountFav(),nameFavButton(),paintFavList()},paintFavList=()=>{favList.innerHTML="";for(const e of favShows){const t=document.createElement("li");favList.appendChild(t),t.setAttribute("id",e.id),t.setAttribute("class","js-fav");const s=document.createElement("h4"),a=document.createTextNode(e.name);t.appendChild(s),s.appendChild(a);const n=document.createElement("div"),o=document.createElement("img");o.setAttribute("src",e.img),n.appendChild(o),t.appendChild(n);const r=document.createElement("span");r.setAttribute("class","js-fav-delete"),r.setAttribute("id",e.id);const i=document.createElement("i");i.setAttribute("class","far fa-times-circle"),r.appendChild(i),t.appendChild(r)}listenDeleteFav(),recountFav(),updateFavSearch(),paintShows()},recountFav=()=>{favShows.length<1?tvFav.innerHTML="Abed's favorite list is empty":1===favShows.length?tvFav.innerHTML=`"${favShows[0].name}" is now Abed's favorite`:favShows.length>1&&(tvFav.innerHTML=`"${favShows[0].name}" and ${favShows.length-1} more are now Abed's favorites`)};function updateFavSearch(){for(const e of favShows){const t=searchShows.find(t=>t.id===e.id);void 0!==t&&(t.fav=!0)}}const handleDeleteFav=e=>{const t=parseInt(e.currentTarget.id),s=favShows.find(e=>e.id===t),a=favShows.indexOf(s);favShows.splice(a,1),paintFavList(),favListMessage(),updateLocalStorage(),deleteFavSearch(),paintShows()},listenDeleteFav=()=>{const e=document.querySelectorAll(".js-fav-delete");for(let t=0;t<e.length;t++){e[t].addEventListener("click",handleDeleteFav)}};function deleteFavSearch(){for(const e of searchShows)if(!0===e.fav){void 0===favShows.find(t=>t.id===e.id)&&(e.fav=!1)}paintShows()}const btnReset=document.querySelector(".js-button-reset"),resetFavs=()=>{favShows=[],updateLocalStorage(),paintFavList(),deleteFavSearch(),recountFav(),nameFavButton(),closeFavs()};btnReset.addEventListener("click",resetFavs);const btnFavs=document.querySelector(".js-favs-toggle"),favToggle=document.querySelector(".js-fav-results"),searchToggle=document.querySelector(".js-search-results"),openFavs=()=>{favToggle.classList.toggle("js-fav-open"),searchToggle.classList.toggle("js-close"),favListMessage(),nameFavButton()},favListMessage=()=>{favToggle.classList.contains("js-fav-open")&&(0===favShows.length?favsWarning.innerHTML="oh no! Abed's show list seems to be empty!":favsWarning.innerHTML="")};btnFavs.addEventListener("click",openFavs);const closeFavs=()=>{favToggle.classList.remove("js-fav-open"),searchToggle.classList.remove("js-close"),nameFavButton()},nameFavButton=()=>{favToggle.classList.contains("js-fav-open")?tvButton.innerHTML="Close favorites":tvButton.innerHTML="Open favorites"};recountFav(),paintFavList(),paintShows(),getFromLocalStorage();