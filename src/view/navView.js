import { Results } from './resultsView';

class NavView extends Results {
  _parentEle;
  _body;
  _input;
  _resultsPanel;
  _searchInput;
  _btnHome;

  render() {
    const markup = this._generateNavMarkup();
    document.body.insertAdjacentHTML('afterbegin', markup);
    this._setFields();
    this.addHandlerOpenSearch();
    this._addHandlerGoHome();
  }

  _setFields() {
    this._body = document.body;
    this._resultsList = document.querySelector('.results__list');
    this._resultsPanel = document.querySelector('.nav__results');
    this._icon = document.querySelector('.icon__path');
    this._searchInput = document.getElementById('search__input');
    this._btnHome = document.querySelector('.home__link');
  }

  _addHandlerGoHome() {
    this._btnHome.addEventListener('click', function () {
      window.location.reload();
    });
  }

  addHandlerOpenSearch() {
    this._body.addEventListener(
      'click',
      function (e) {
        if (!e.target.closest('.search__btn')) return;
        e.preventDefault();
        this._searchInput.classList.toggle('showInput');
        this._icon.setAttribute('d', 'M6 18 18 6M6 6l12 12');
        this._searchInput.value = '';
        if (!this._searchInput.classList.contains('showInput'))
          this._icon.setAttribute(
            'd',
            'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
          );
        this._closePanel();
      }.bind(this)
    );
  }

  _closePanel() {
    this._resultsPanel.classList.add('hidden');
    this._resultsList.innerHTML = '';
  }

  _generateNavMarkup() {
    return `
     <section class="nav__container">
      <nav class="nav">
        <form class="search">
          <div class="search__input__container" id="nav__input">
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
                  class="icon__path"
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search"
              id="search__input"
              class=""
            />
          </div>
          <div class="results hidden nav__results">
            <ul class="results__list"></ul>
          </div>
        </form>
        <div class="nav__links--container">
          <a href="#" class="home__link">Return home</a>
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
                <p>No Bookmarks yet, add a Bookmark!</p>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </section>
        `;
  }
}

export default new NavView();
