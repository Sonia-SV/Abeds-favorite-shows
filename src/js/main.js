'use strict';

//Arrays

let searchShows = [];
let favShows = [];

//Const
const searchInput = document.querySelector('.js-search');
const mainPage = document.querySelector('.js-main-results');
const searchButton = document.querySelector('.js-search-button');

const searchList = document.createElement('ul');
const favList = document.createElement('ul');

searchList.setAttribute('class', 'main__results__search');
favList.setAttribute('class', 'main__results__fav');
mainPage.appendChild(searchList);
mainPage.appendChild(favList);

/*-----------------------------------GET SHOWS FROM API-----------------------------------*/

//Handle events
const handleSearchButton = (ev) => {
  ev.preventDefault();
  resetSearch();
  getShowsFromApi();
};

//Reset Search
const resetSearch = () => {
  searchShows = [];
  searchList.innerHTML = '';
};

//Api search
const getShowsFromApi = () => {
  let searchShow = searchInput.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${searchShow}`)
    .then((response) => response.json())
    .then((searchData) => {
      for (const data of searchData) {
        searchShows.push(data.show);
      }
      for (const show of searchShows) {
        paintShows(show);
      }
    });
};

/*--------------------------------------PAINT SEARCH--------------------------------------*/

const paintShows = (ev) => {
  //This part of the function creates <li> labels with DOM tools and assings the show.id to the <li>
  const listItem = document.createElement('li');
  searchList.appendChild(listItem);
  listItem.setAttribute('id', ev.id);
  listItem.setAttribute('class', 'js-item');

  //This part of the function creates the elements inside the <li> label: tittle and img.
  //Tittle
  const listTittle = document.createElement('h3');
  const tittleName = document.createTextNode(ev.name);
  listItem.appendChild(listTittle);
  listTittle.appendChild(tittleName);

  //Image
  const listImage = document.createElement('img');
  if (ev.image !== null) {
    listImage.setAttribute('src', ev.image.medium);
  }
  if (ev.image === null) {
    listImage.setAttribute('src', 'https://via.placeholder.com/210x295/555555/FFFFFF/?text=OPS!+:)');
  }
  listItem.appendChild(listImage);

  listenFavClicks();
};

searchButton.addEventListener('click', handleSearchButton);
// searchInput.addEventListener('keyup', function (ev) {
//   if (ev.keycode === 13) {
//     ev.preventDefault();
//     handleSearchButton();
//   }
// });

/*------------------------------------ADD SHOWS TO FAV------------------------------------*/

const handleShowFav = (ev) => {
  const clickedId = parseInt(ev.currentTarget.id);
  //console.log(clickedId);
  const showList = searchShows.find((selectedShow) => selectedShow.id === clickedId);
  const clickedShow = favShows.find((selectedShow) => selectedShow.id === clickedId);
  // console.log(searchShows);
  // console.log(clickedShow);
  // console.log(showList.id);

  if (clickedShow === undefined) {
    favShows.push(showList);
    favStyle(ev);
  } else {
    const showIdx = favShows.indexOf(clickedShow);
    favShows.splice(showIdx, 1);
    favStyle(ev);
  }
  updateLocalStorage();
};

const listenFavClicks = () => {
  const listItem = document.querySelectorAll('.js-item');
  for (let index = 0; index < listItem.length; index++) {
    const clickedItem = listItem[index];
    clickedItem.addEventListener('click', handleShowFav);
  }
};

/*-------------------------------------LOCAL STORAGE--------------------------------------*/
const updateLocalStorage = () => {
  localStorage.setItem('fav', JSON.stringify(favShows));
};

const getFromLocalStorage = () => {
  const data = JSON.parse(localStorage.getItem('fav'));
  if (data !== null) {
    favShows = data;
  }
};

/*--------------------------------------PAINT FAV--------------------------------------*/
const favStyle = (ev) => {
  ev.currentTarget.classList.toggle('fav__background');
  favList.innerHTML = '';
  for (const show of favShows) {
    paintFavList(show);
  }
};

const paintFavList = (ev) => {
  //This part of the function creates <li> labels with DOM tools and assings the show.id to the <li>
  const listItem = document.createElement('li');
  favList.appendChild(listItem);
  listItem.setAttribute('id', ev.id);
  listItem.setAttribute('class', 'js-fav');

  //This part of the function creates the elements inside the <li> label: tittle and img.
  //Tittle
  const listTittle = document.createElement('h3');
  const tittleName = document.createTextNode(ev.name);
  listItem.appendChild(listTittle);
  listTittle.appendChild(tittleName);

  //Image
  const listImage = document.createElement('img');
  if (ev.image !== null) {
    listImage.setAttribute('src', ev.image.medium);
  }
  if (ev.image === null) {
    listImage.setAttribute('src', 'https://via.placeholder.com/210x295/111111/FFFFFF/?text=OPS!+:)');
  }
  listItem.appendChild(listImage);
};

//paintFavList();
getFromLocalStorage();
