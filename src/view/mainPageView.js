import {
  convertRuntime,
  Convertnumber,
  ageRateFormater,
  displayTrailer,
  getLanguage,
} from '../helper';

class MainView {
  #data;
  #parentEle = document.querySelector('.slider__collaction--container');
  #searchInput = document.getElementById('search__input');
  #resultsList = document.querySelector('.results__list');
  #panal = document.querySelector('.nav__results');
  #icon = document.querySelector('.icon__path');
  #body = document.body;

  constructor() {
    this.#addHandlerOpenSearch();
  }

  render(data) {
    this.#data = data;
    console.log(this.#data);
    const markup = this.#generateMarkup();
    this.#parentEle.insertAdjacentHTML('afterbegin', markup);
  }

  #addHandlerOpenSearch() {
    this.#body.addEventListener(
      'click',
      function (e) {
        if (!e.target.closest('.search__btn')) return;
        e.preventDefault();
        this.#searchInput.classList.toggle('showInput');
        this.#icon.setAttribute('d', 'M6 18 18 6M6 6l12 12');
        this.#searchInput.value = '';
        if (!this.#searchInput.classList.contains('showInput'))
          this.#icon.setAttribute(
            'd',
            'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
          );
        this.#closePanel();
      }.bind(this)
    );
  }

  #closePanel() {
    this.#panal.classList.add('hidden');
    this.#resultsList.innerHTML = '';
  }

  #generateMarkup() {
    return this.#data
      .slice(0, 6)
      .map(obj => this.#markup(obj))
      .join('');
  }

  #markup(obj) {
    return `
    <div class="collaction__element slider__element" data-id=${
      obj.id
    } data-type=${
      obj.media_type
    } style="background-image: linear-gradient(to bottom, #1a1d293d, #111526ad), url('https://image.tmdb.org/t/p/original${
      obj.poster_path || obj.backdrop_path
    }')">
      <div class="collaction__top">
        <div class="collaction--imdb__rating">
          <span>${Convertnumber(obj.vote_average)}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon__star"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </div>
      </div>
      <div class="collaction__bottom">
        <h4 class="collaction__head">${obj.original_title || obj.name}</h4>
        <p class="collaction__year">${
          obj.release_date?.split('-')[0] ||
          obj.air_date?.split('-')[0] ||
          'N/A'
        }</p>
        ${
          obj.episode_count
            ? `<p class="collaction__year">${obj.episode_count} episode</p>`
            : ''
        }
      </div>
    </div>
    `;
  }
}

export default new MainView();
