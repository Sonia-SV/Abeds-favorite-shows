'use strict';

//Arrays

let searchShows = [];
let favShows = [];

//Const
const searchInput = document.querySelector('.js-search');
const mainPage = document.querySelector('.js-main-results');
const searchButton = document.querySelector('.js-search-button');
const favListContainer = document.createElement('div');
const searchList = document.createElement('ul');
const favList = document.createElement('ul');

searchList.setAttribute('class', 'main__results__search');
favList.setAttribute('class', 'main__results__fav');
mainPage.appendChild(favListContainer);
mainPage.appendChild(searchList);
favListContainer.appendChild(favList);

const resetItem = document.createElement('div');
const reset = document.createTextNode('DALE A RESET');
resetItem.setAttribute('class', 'js-button-reset');
favListContainer.appendChild(resetItem);
resetItem.appendChild(reset);

/*-----GET SHOWS FROM API-----*/

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
      if (searchData.length === 0) {
        console.log('La búsqueda no ha dado resultados');
        //ESCRIBIR ESTO EN PANTALLA
      }
      for (const data of searchData) {
        if (data.show.image !== null) {
          searchShows.push({
            id: data.show.id,
            name: data.show.name,
            img: data.show.image.medium,
            fav: false,
          });
        } else {
          searchShows.push({
            id: data.show.id,
            name: data.show.name,
            img: 'https://via.placeholder.com/210x295/555555/FFFFFF/?text=OPS!+:)',
            fav: false,
          });
        }
      }
      updateFavSearch();
      paintShows();
    });
};

/*-----PAINT SEARCH-----*/

const paintShows = () => {
  searchList.innerHTML = '';

  for (const show of searchShows) {
    //This part of the function creates <li> labels with DOM tools and assings the show.id to the <li>
    const listItem = document.createElement('li');
    searchList.appendChild(listItem);
    listItem.setAttribute('id', show.id);
    listItem.setAttribute('class', 'js-item');
    if (show.fav === true) {
      listItem.classList.add('js-fav-item');
    } else if (show.fav === false) {
      listItem.classList.remove('js-fav-item');
    }

    //This part of the function creates the elements inside the <li> label: tittle and img.
    //Tittle
    const listTittle = document.createElement('h3');
    const tittleName = document.createTextNode(show.name);
    listItem.appendChild(listTittle);
    listTittle.appendChild(tittleName);

    //Image
    const listImage = document.createElement('img');
    listImage.setAttribute('src', show.img);

    listItem.appendChild(listImage);
    listenFavClicks();
  }
};

searchButton.addEventListener('click', handleSearchButton);

/*-----ADD SHOWS TO FAV-----*/

const handleShowFav = (ev) => {
  const clickedId = parseInt(ev.currentTarget.id);
  const showList = searchShows.find((selectedShow) => selectedShow.id === clickedId);
  const clickedShow = favShows.find((selectedShow) => selectedShow.id === clickedId);

  if (clickedShow === undefined) {
    showList.fav = true;
    favShows.push(showList);
  } else {
    const showIdx = favShows.indexOf(clickedShow);
    favShows.splice(showIdx, 1);
    showList.fav = false;
  }
  updateFavSearch();
  paintShows();
  updateLocalStorage();
  paintFavList();
};

const listenFavClicks = () => {
  const listItem = document.querySelectorAll('.js-item');
  for (let index = 0; index < listItem.length; index++) {
    const clickedItem = listItem[index];
    clickedItem.addEventListener('click', handleShowFav);
  }
};

/*-----LOCAL STORAGE-----*/
const updateLocalStorage = () => {
  localStorage.setItem('fav', JSON.stringify(favShows));
};

const getFromLocalStorage = () => {
  const data = JSON.parse(localStorage.getItem('fav'));
  if (data !== null) {
    favShows = data;
  }
  paintFavList();
};

/*-----PAINT FAV-----*/

const paintFavList = () => {
  favList.innerHTML = '';
  for (const fav of favShows) {
    //This part of the function creates <li> labels with DOM tools and assings the show.id to the <li>
    const listItem = document.createElement('li');
    favList.appendChild(listItem);
    listItem.setAttribute('id', fav.id);
    listItem.setAttribute('class', 'js-fav');

    //This part of the function creates the elements inside the <li> label: tittle and img.
    //Tittle
    const listTittle = document.createElement('h4');
    const tittleName = document.createTextNode(fav.name);
    listItem.appendChild(listTittle);
    listTittle.appendChild(tittleName);

    //Image
    const listImage = document.createElement('img');
    listImage.setAttribute('src', fav.img);

    listItem.appendChild(listImage);

    //Delete icon
    const spanDelete = document.createElement('span');
    spanDelete.setAttribute('class', 'js-fav-delete');
    spanDelete.setAttribute('id', fav.id);
    const iDelete = document.createElement('i');
    iDelete.setAttribute('class', 'far fa-times-circle');
    spanDelete.appendChild(iDelete);
    listItem.appendChild(spanDelete);
  }
  listenDeleteFav();
  updateFavSearch();
  paintShows();
};

function updateFavSearch() {
  for (const fav of favShows) {
    const matchShow = searchShows.find((currentShow) => currentShow.id === fav.id);
    if (matchShow !== undefined) {
      matchShow.fav = true;
    }
  }
}
/*-----DELETE FAV-----*/

const handleDeleteFav = (ev) => {
  const clickedId = parseInt(ev.currentTarget.id);
  const clickedShow = favShows.find((selectedShow) => selectedShow.id === clickedId);
  const showIdx = favShows.indexOf(clickedShow);
  favShows.splice(showIdx, 1);
  paintFavList();
  updateLocalStorage();
  deleteFavSearch();
  paintShows();
};

const listenDeleteFav = () => {
  const favItem = document.querySelectorAll('.js-fav-delete');
  for (let index = 0; index < favItem.length; index++) {
    const clickedItem = favItem[index];
    clickedItem.addEventListener('click', handleDeleteFav);
  }
};

function deleteFavSearch() {
  for (const show of searchShows) {
    if (show.fav === true) {
      const matchShow = favShows.find((currentShow) => currentShow.id === show.id);
      if (matchShow === undefined) {
        show.fav = false;
      }
    }
  }
  paintShows();
}

/*-----RESET FAV AND LOCAL STORAGE-----*/

const btnReset = document.querySelector('.js-button-reset');

const resetFavs = () => {
  favShows = [];
  updateLocalStorage();
  paintFavList();
  deleteFavSearch();
};

btnReset.addEventListener('click', resetFavs);

paintFavList();
paintShows();
getFromLocalStorage();
