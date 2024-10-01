import { Results } from './resultsView';

class NavView extends Results {
  _resultsPanel;
  _parentEle;
  _body;
  _input;

  render() {
    const markup = this._generateNavMarkup();
    document.body.insertAdjacentHTML('afterbegin', markup);
    this._setFields();
  }

  _setFields() {
    this._resultsPanel = document.querySelector('.results');
    this._parentEle = document.querySelector('.results__list');
    this._body = document.body;
    this._input = document.querySelector('#search__input');
  }

  _generateNavMarkup() {
    return `
    <nav class="nav">
      <form class="search">
        <div class="search__input__container" id="nav__input">
          <input type="text" placeholder="Search" id="search__input" />
          <button class="search__btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="search__icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
        <div class="results hidden nav__results">
          <ul class="results__list">
          </ul>
        </div>
      </form>
      <button class="btn add__bookmark nav__btn nav__btn--bookmarks">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="bookmark__icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
          />
        </svg>
      </button>
      <div class="bookmarks">
        <ul class="bookmarks__list">
          <div class="text">
            <p>
              No Bookmarks yet, add a Bookmark!
            </p>
          </div>
        </ul>
      </div>
    </nav>
        `;
  }
}

export default new NavView();
