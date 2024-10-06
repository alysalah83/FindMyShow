import { getLanguage } from '../helper';

export class Results {
  _data;
  _searchInput;
  _resultsPanel;
  _resultsList;

  renderResults(data) {
    this._data = data;
    this._sortDataByPopularity();
    const markup = this._generateMarkup();
    this._clear();
    this._resultsList.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
        <div class="load__spinner--container">
            <div class="load__spinner"></div>
            <div class="load__spinner"></div>
            <div class="load__spinner"></div>
        </div>
        `;
    this._bodyClear();
    this._body.insertAdjacentHTML('afterbegin', markup);
  }

  _sortDataByPopularity() {
    this._data.sort((a, b) => b.popularity - a.popularity);
  }

  _bodyClear() {
    this._body.innerHTML = '';
  }

  _clear() {
    this._resultsList = document.querySelector('.results__list');
    this._resultsList.innerHTML = '';
  }

  addHandlerSearching(handler) {
    this._searchInput.addEventListener(
      'input',
      function () {
        this._resultsPanel.classList.remove('hidden');
        const { value } = this._searchInput;
        if (value === '') {
          this._clear();
          this._resultsPanel.classList.add('hidden');
          return;
        }
        handler(value);
      }.bind(this)
    );
  }

  addHandlerSearchSubmit(handler) {
    this._body.addEventListener('click', function (e) {
      const listEle = e.target.closest('.result');
      if (!listEle) return;
      const { id } = listEle.dataset;
      const { type } = listEle.dataset;
      handler(id, type);
    });
  }

  _generateMarkup() {
    return this._data.map(res => this._markup(res)).join('');
  }

  _markup(res) {
    if (!(res.backdrop_path || res.poster_path)) return;
    return `
  <li class="result" data-id=${res.id} data-type=${res.media_type}>
    <img
      src="https://res.cloudinary.com/dothardix/image/fetch/w_140,c_fill,q_auto/https://image.tmdb.org/t/p/original/${
        res.poster_path || res.backdrop_path
      }"
      alt="${res.title || res.name} poster"
      class="list__image"
    />
    <div class="list__descrption">
      <h3 class="list__title">${res.title || res.name}</h3>
      <p class="descrption"><span>${
        res.media_type === 'tv'
          ? `TV Series`
          : res.media_type.replace(
              res.media_type[0],
              res.media_type[0].toUpperCase()
            )
      }</span><span>${
      (res.release_date || res.first_air_date)?.split('-')[0] || 'N/A'
    }</span></p>
      <p class="descrption">${getLanguage(res.original_language)}</p>
    </div>
  </li>`;
  }
}
