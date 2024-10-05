import {
  convertRuntime,
  Convertnumber,
  ageRateFormater,
  displayTrailer,
  getLanguage,
} from '../helper';

class MainView {
  #data;
  #parentEle;
  #sliderParent;
  #resultsEle;
  #btnRight;
  #btnleft;
  #type;

  #body = document.body;
  #resultsList = document.querySelector('.results__list');
  #panal = document.querySelector('.nav__results');
  #icon = document.querySelector('.icon__path');
  #searchInput = document.getElementById('search__input');

  constructor() {
    this.addHandlerOpenSearch();
    this.#addHandlerSlide();
    this.#addHandlerSlideMobile();
  }

  render(data, parent, type) {
    this.#parentEle = document.querySelector(`.${parent}`);
    this.#sliderParent = this.#parentEle.querySelector(
      '.slider__collaction--container'
    );
    this.#data = data;
    this.#type = type;
    const markup = this.#generateMarkup();
    this.#sliderParent.insertAdjacentHTML('afterbegin', markup);
    this.#resultsEle = Array.from(
      this.#sliderParent.querySelectorAll('.slider__element')
    );
  }

  addHandlerOpenSearch() {
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

  #addHandlerSlideMobile() {
    let touchStartX = 0;
    let touchEndX = 0;
    let currentTranslate = 0;
    let sliderParent = null;
    let resultsEle = null;
    const perSlide = 2; // عدد العناصر التي يتم تحريكها في كل مرة

    // Event listener for touchstart
    this.#body.addEventListener('touchstart', e => {
      sliderParent = e.target.closest('.slider__collaction--container');
      if (!sliderParent) return;

      resultsEle = Array.from(
        sliderParent.querySelectorAll('.slider__element')
      );

      touchStartX = e.touches[0].clientX;
    });

    // Event listener for touchmove
    this.#body.addEventListener('touchmove', e => {
      if (!sliderParent || !resultsEle) return;

      touchEndX = e.touches[0].clientX;
      const touchDeltaX = touchEndX - touchStartX;

      // Update translateX based on touch movement
      resultsEle.forEach(ele => {
        ele.style.transition = 'none';
        ele.style.transform = `translateX(${currentTranslate + touchDeltaX}px)`;
      });
    });

    // Event listener for touchend
    this.#body.addEventListener('touchend', e => {
      if (!sliderParent || !resultsEle) return;

      const elementWidth = resultsEle[0].offsetWidth; // عرض العنصر الواحد
      const elementGap = parseFloat(getComputedStyle(sliderParent).gap); // المسافة بين العناصر
      const moveDistance = (elementWidth + elementGap) * perSlide; // المسافة التي يتم تحريكها (عرض 3 عناصر)

      const totalElementsWidth = resultsEle.reduce(
        (total, ele) =>
          total +
          ele.offsetWidth +
          parseFloat(getComputedStyle(sliderParent).gap),
        0
      );

      const touchDeltaX = touchEndX - touchStartX;

      if (touchDeltaX < -50) {
        // سحب لليسار (تحريك لليمين) - تحريك 3 عناصر
        currentTranslate -= moveDistance;
      } else if (touchDeltaX > 50) {
        // سحب لليمين (تحريك لليسار) - تحريك 3 عناصر
        currentTranslate += moveDistance;
      }

      // ضبط الحدود لمنع تجاوز العناصر لنطاق السلايدر
      if (currentTranslate > 0) {
        currentTranslate = 0;
      } else if (
        Math.abs(currentTranslate) >
        totalElementsWidth - sliderParent.offsetWidth
      ) {
        currentTranslate = -(totalElementsWidth - sliderParent.offsetWidth);
      }

      // تطبيق الحركة النهائية مع انتقال سلس
      resultsEle.forEach(ele => {
        ele.style.transition = 'transform 0.3s ease';
        ele.style.transform = `translateX(${currentTranslate}px)`;
      });

      // Reset after the swipe ends
      sliderParent = null;
      resultsEle = null;
    });
  }

  #addHandlerSlide() {
    this.#body.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.btn__go');
        if (!btn) return;

        this.#parentEle = btn.closest('.slider__container');
        this.#sliderParent = this.#parentEle.querySelector(
          '.slider__collaction--container'
        );
        this.#resultsEle = Array.from(
          this.#sliderParent.querySelectorAll('.slider__element')
        );
        this.#btnleft = this.#parentEle.querySelector('.left');
        this.#btnRight = this.#parentEle.querySelector('.right');

        btn.classList.contains('right')
          ? this.#slideRight(btn)
          : this.#slideLeft(btn);
      }.bind(this)
    );

    let touchStartX = 0;
    let touchEndX = 0;
    let currentTranslate = 0;
  }

  #slideRight(btnRight) {
    let perSlide = 6;
    const totalEle = this.#resultsEle.length;
    const lastSlide = Math.ceil(totalEle / perSlide);
    let curslide = Number(btnRight.dataset.curslide);
    const rest = totalEle % perSlide;
    let remaning = 0;
    console.log(window.innerWidth);

    this.#btnleft.classList.remove('btn__hidden');

    if (curslide === lastSlide) return;

    if (curslide === lastSlide - 1 && rest !== 0) remaning = perSlide - rest;

    this.#resultsEle.forEach(ele => {
      const eleWidth = ele.offsetWidth;
      const eleGap = parseFloat(getComputedStyle(this.#sliderParent).gap);

      ele.style.transform = `translateX(${
        (eleWidth + eleGap) * (perSlide * curslide - remaning) * -1
      }px)`;
    });

    btnRight.dataset.curslide = curslide + 1;
    this.#btnleft.dataset.curslide = curslide + 1;
    if (curslide === lastSlide - 1) btnRight.classList.add('btn__hidden');
  }

  #slideLeft(btnLeft) {
    let perSlide = 6;
    let curslide = Number(btnLeft.dataset.curslide);

    this.#btnRight.classList.remove('btn__hidden');

    if (curslide === 1) return;

    this.#resultsEle.forEach(ele => {
      const eleWidth = ele.offsetWidth;
      const eleGap = parseFloat(getComputedStyle(this.#sliderParent).gap);

      ele.style.transform = `translateX(${
        (eleWidth + eleGap) * 6 -
        (eleWidth + eleGap) * (perSlide * (curslide - 1))
      }px)`;
    });

    btnLeft.dataset.curslide = curslide - 1;
    this.#btnRight.dataset.curslide = curslide - 1;
    if (curslide === 2) btnLeft.classList.add('btn__hidden');
  }

  #generateMarkup() {
    return this.#data.map((obj, i) => this.#markup(obj, i)).join('');
  }

  #markup(obj, i) {
    return `
    <div class="collaction__element slider__element" data-id=${
      obj.id
    } data-type=${
      this.#type
    } data-position = ${i}  style="background-image: linear-gradient(to bottom, #1a1d293d, #111526ad), url('https://image.tmdb.org/t/p/w300${
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
        <h4 class="collaction__head">${obj.title || obj.name}</h4>
        <p class="collaction__year">${
          obj.release_date?.split('-')[0] ||
          obj.first_air_date?.split('-')[0] ||
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
