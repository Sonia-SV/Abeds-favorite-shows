'use strict';

//Arrays

let searchShows = [];
let favShows = [];

//Const
const search = document.querySelector('.js-search');

//handle events
const searchButton = document.querySelector('.js-search-button');

function handleSearchButton(ev) {
  ev.preventDefault();
  getShowsFromApi();
}

//Api

const getShowsFromApi = () => {
  let searchShow = search.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${searchShow}`)
    .then((response) => response.json())
    .then((searchData) => {
      console.log(searchData);
      for (const data of searchData) {
        paintSearchShows(data);
      }
    });
};

//Paint

const paintSearchShows = (ev) => {
  console.log(ev.show);
  console.log(ev.show.id);
  console.log(ev.show.name);
  console.log(ev.show.image.medium);
};
getShowsFromApi();

searchButton.addEventListener('click', handleSearchButton);
