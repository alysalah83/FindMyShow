import { Results } from './resultsView';

class SearchResults extends Results {
  _resultsPanel = document.querySelector('.results');
  _parentEle = document.querySelector('.results__list');
  _body = document.body;
  _input = document.querySelector('#search__input');
}

export default new SearchResults();
