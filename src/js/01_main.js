'use strict';
//Const
const formSubmit = document.querySelector('.js-form');
const searchInput = document.querySelector('.js-search');

const favList = document.querySelector('.js-fav-list');
const searchList = document.querySelector('.js-search-list');
const tvFav = document.querySelector('.js-tv-fav');
const searchButton = document.querySelector('.js-search-button');
const tvButton = document.querySelector('.js-tv-fav-btn');
const errorSearch = document.querySelector('.js-error-message');
const favsWarning = document.querySelector('.js-fav-message');

//Arrays

let searchShows = [];
let favShows = [];

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
        errorSearch.innerHTML = `We can't find nothing, try again!`;
      } else {
        errorSearch.innerHTML = '';
      }
      for (const data of searchData) {
        console.log(data.show.schedule.days);
        let days;
        if (data.show.schedule.days.length > 1) {
          days = data.show.schedule.days;
        } else {
          days = data.show.schedule.days;
        }

        if (data.show.image !== null) {
          searchShows.push({
            id: data.show.id,
            name: data.show.name,
            img: data.show.image.medium,
            fav: false,
            day: days,
          });
          console.log(searchShows);
        } else {
          searchShows.push({
            id: data.show.id,
            name: data.show.name,
            img: './assets/images/Cornelius.png',
            fav: false,
            day: days,
          });
          console.log(searchShows);
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
    //This part of the function creates <li> labels with DOM tools and
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
    listTittle.setAttribute('class', 'h3');
    const tittleName = document.createTextNode(show.name);
    listItem.appendChild(listTittle);
    listTittle.appendChild(tittleName);

    //Image assings the show.id to the <li>
    const imgcontainer = document.createElement('div');
    const listImage = document.createElement('img');
    listImage.setAttribute('src', show.img);
    imgcontainer.appendChild(listImage);

    //Days
    const listDays = document.createElement('h4');
    listDays.setAttribute('class', 'h4');
    const scheudleDay = document.createTextNode(show.day);
    listItem.appendChild(listDays);
    listDays.appendChild(scheudleDay);

    listItem.appendChild(imgcontainer);
    listenFavClicks();
    paintCommunityCast(show, imgcontainer);
  }
};

formSubmit.addEventListener('submit', handleSearchButton);
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
  recountFav();
  nameFavButton();
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
    const imgcontainer = document.createElement('div');
    const listImage = document.createElement('img');
    listImage.setAttribute('src', fav.img);
    imgcontainer.appendChild(listImage);

    listItem.appendChild(imgcontainer);

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
  recountFav();
  updateFavSearch();
  paintShows();
};

const recountFav = () => {
  if (favShows.length < 1) {
    tvFav.innerHTML = `Abed's favorite list is empty`;
  } else if (favShows.length === 1) {
    tvFav.innerHTML = `"${favShows[0].name}" is now Abed's favorite`;
  } else if (favShows.length > 1) {
    tvFav.innerHTML = `"${favShows[0].name}" and ${favShows.length - 1} more are now Abed's favorites`;
  }
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
  favListMessage();
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
  recountFav();
  nameFavButton();
  closeFavs();
};

btnReset.addEventListener('click', resetFavs);

/*-----OPEN FAVS-----*/
const btnFavs = document.querySelector('.js-favs-toggle');
const favToggle = document.querySelector('.js-fav-results');
const searchToggle = document.querySelector('.js-search-results');

const openFavs = () => {
  favToggle.classList.toggle('js-fav-open');
  searchToggle.classList.toggle('js-close');

  favListMessage();
  nameFavButton();
};

const favListMessage = () => {
  if (favToggle.classList.contains('js-fav-open')) {
    if (favShows.length === 0) {
      favsWarning.innerHTML = `oh no! Abed's show list seems to be empty!`;
    } else {
      favsWarning.innerHTML = '';
    }
  }
};

btnFavs.addEventListener('click', openFavs);

const closeFavs = () => {
  favToggle.classList.remove('js-fav-open');
  searchToggle.classList.remove('js-close');
  nameFavButton();
};

/*-----PAINT FAVS BUTTON-----*/

const nameFavButton = () => {
  if (favToggle.classList.contains('js-fav-open')) {
    tvButton.innerHTML = 'Close favorites';
  } else {
    tvButton.innerHTML = 'Open favorites';
  }
};

/*-----SPECIAL COMMUNITY CAST-----*/

const paintCommunityCast = (ev, frame) => {
  if (ev.id === 17869) {
    const listFrame = document.createElement('div');
    frame.appendChild(listFrame);
    listFrame.classList.add('js-annie-frame');
  }
  if (ev.id === 6765) {
    const listFrame = document.createElement('div');
    frame.appendChild(listFrame);
    listFrame.classList.add('js-britta-frame');
  }
  if (ev.id === 6508) {
    const listFrame = document.createElement('div');
    frame.appendChild(listFrame);
    listFrame.classList.add('js-troy-frame');
  }
  if (ev.id === 34453) {
    const listFrame = document.createElement('div');
    frame.appendChild(listFrame);
    listFrame.classList.add('js-jeff-frame');
  }
  if (ev.id === 361) {
    const listFrame = document.createElement('div');
    frame.appendChild(listFrame);
    listFrame.classList.add('js-pierce-frame');
  }
  if (ev.id === 988) {
    const listFrame = document.createElement('div');
    frame.appendChild(listFrame);
    listFrame.classList.add('js-shirley-frame');
  }
};

recountFav();
paintFavList();
paintShows();
getFromLocalStorage();
