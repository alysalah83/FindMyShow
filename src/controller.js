import * as model from './model.js';
import bookmarkView from './view/bookmarkView.js';
import movieView from './view/movieView.js';
import navView from './view/navView.js';
import searchResultsView from './view/searchResultsView.js';
import mainPageView from './view/mainPageView.js';

const controllSearchResults = async function (query) {
  // getting result data for the typing query
  await model.resultsData(query);

  // render that data on the search results panal
  searchResultsView.renderResults(model.state.results);
};

const controllNavResults = async function (query) {
  // getting result data for the typing query
  await model.resultsData(query);

  // render that data on the search results panal
  navView.renderResults(model.state.results);
};

const controllLoadData = async function (id, type) {
  // render spinner
  searchResultsView.renderSpinner();

  // getting and setting movie data
  await model.getData(id, type);

  // render movie data
  if (type === 'tv') {
    movieView.render(model.state.tvShow);

    // send data to bookmarksView
    bookmarkView.setData(model.state.tvShow);
  }
  if (type === 'movie') {
    movieView.render(model.state.movie);

    // send data to bookmarksView
    bookmarkView.setData(model.state.movie);
  }

  //render Nav
  navView.render();

  //render booksmark
  if (model.state.bookmarks.length > 0)
    bookmarkView.render(model.state.bookmarks);

  //add results Handler to nav input
  navView.addHandlerSearching(controllNavResults);
};

const controllBookmarks = function (data) {
  // adding and removing bookmark on clcik
  if (!data.bookmarked) model.addBookmark(data);
  else model.removeBookmark(data);

  // render the bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controllLoadPopular = async function () {
  //geting popular results
  await model.loadPopular();

  //render results
  mainPageView.render(model.state.popularMoviesResults);
};

const init = function () {
  searchResultsView.addHandlerSearchSubmit(controllLoadData);
  searchResultsView.addHandlerSearching(controllSearchResults);
  movieView.addHandlerOpenCollaction(controllLoadData);
  bookmarkView.addHandlerBookmark(controllBookmarks);
  model.loadBookmarks();
  controllLoadPopular();
};

init();
