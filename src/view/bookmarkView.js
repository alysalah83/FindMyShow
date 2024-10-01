import { getLanguage } from '../helper';

class Bookmark {
  #parentEle;
  #body = document.body;
  #panel;
  #bookmarkIcon;
  #data;
  #bookmarksData;
  #bookmarkList;

  render(data) {
    this.#bookmarksData = data;
    const markup = this.#generateMarkup();
    this.#bookmarkList = document.querySelector('.bookmarks__list');
    this.#clear();
    this.#bookmarkList.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#bookmarkList.innerHTML = '';
  }

  addHandlerBookmark(handler) {
    this.#body.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.btn__bookmark');
        if (!btn) return;
        this.#setFields();
        this.#bookmarkIcon.classList.toggle('active');
        handler(this.#data);
      }.bind(this)
    );
  }

  setData(data) {
    this.#data = data;
  }

  #setFields() {
    this.#parentEle = document.querySelector('.btn__bookmark');
    this.#panel = document.querySelector('.bookmarks');
    this.#bookmarkIcon = document.querySelector('.icon__add');
    this.#bookmarkList = document.querySelector('.bookmarks__list');
  }

  #generateMarkup() {
    return this.#bookmarksData.map(res => this.#markup(res)).join('');
  }

  #markup(res) {
    if (!res.bookmarked)
      return `
    <div class="text">
        <p>
          No Bookmarks yet, add a Bookmark!
        </p>
      </div>`;
    return `
    <li class="result" data-id=${res.id} data-type=${res.type}>
    <img
      src="https://image.tmdb.org/t/p/original${res.image}"
      alt="${res.title} poster"
      class="list__image"
    />
    <div class="list__descrption">
      <h3 class="list__title">${res.title}</h3>
      <p class="descrption"><span>${
        res.type === 'tv'
          ? 'TV Series'
          : res.type.replace(res.type[0], res.type[0].toUpperCase())
      }</span><span>${res.puplishedDate.split('-')[0] || 'N/A'}</span></p>
      <p class="descrption">${getLanguage(res.language)}</p>
    </div>
  </li>
    `;
  }
}

export default new Bookmark();
