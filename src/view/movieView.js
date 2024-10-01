import {
  convertRuntime,
  Convertnumber,
  ageRateFormater,
  displayTrailer,
  getLanguage,
} from '../helper';
import { DISPLAY_PER_IMAGE } from '../config';
import image from 'url:../../imdb.jpg';
import lazySizes from 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

class MovieView {
  #data;
  #parentEle = document.body;
  #overlay;
  #window;

  constructor() {
    document.addEventListener('DOMContentLoaded', function () {
      lazySizes.init();
    });
  }

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentEle.insertAdjacentHTML('afterbegin', markup);
    this.#renderOverlay();
    this.#addHandlerOpenTrailer();
    this.#addHanlerCloseTrailer();
  }

  #clear() {
    this.#parentEle.innerHTML = '';
  }

  #renderOverlay() {
    const trailerMarkup = this.#generateTrailerMarkup();
    this.#parentEle.insertAdjacentHTML('afterbegin', trailerMarkup);
    this.#overlay = document.querySelector('.overlay');
    this.#window = document.querySelector('.window');
  }

  #toggleTrailer() {
    this.#overlay.classList.toggle('active');
    this.#window.classList.toggle('active');
  }

  #addHandlerOpenTrailer() {
    this.#parentEle.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.play__btn');
        if (!btn) return;
        this.#toggleTrailer();
      }.bind(this)
    );
  }

  addHandlerOpenCollaction(handler) {
    this.#parentEle.addEventListener('click', function (e) {
      const movieEle = e.target.closest('.collaction__element');
      if (!movieEle) return;
      const { id } = movieEle.dataset;
      const { type } = movieEle.dataset;
      if (type === 'undefined') return;
      handler(id, type);
    });
  }

  #closeTrailer() {
    document.querySelector(
      'iframe'
    ).src = `https://www.youtube.com/embed/${displayTrailer(
      this.#data.trailers
    )}`;
    this.#toggleTrailer();
  }

  #addHanlerCloseTrailer() {
    this.#overlay.addEventListener(
      'click',
      function (e) {
        const overlay = e.target.closest('.overlay');
        if (!overlay) return;
        this.#closeTrailer();
      }.bind(this)
    );
  }

  #generateMarkup() {
    return `
    <main class="main__container scroll" >
        <div class="movie__info--container">
            <div class="poster__container">
              <div class="img__container">
                <img
                    src='https://image.tmdb.org/t/p/original${this.#data.image}'
                    alt="${this.#data.title} movie poster"
                />
              </div>
              <div class="poster__footer">
                <button class="btn add__bookmark btn__bookmark"}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="bookmark__icon icon__add ${
                      this.#data.bookmarked ? 'active' : ''
                    }"
                >
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                    />
                </svg>
                </button>
                <a href="#" class="play__btn" aria-label="Play Trailer">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="play__icon"
                >
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                    />
                </svg>
                <p class="play__text">Play Trailer</p>
                </a>
              </div>
            </div>
          <div class="movie__details--container">
            <ul class="lists">
                <li class="heading list">
                <h1 class="movie__title">${this.#data.title}</h1>
                </li>
                <li class="list">
                <span class="tag tag-color-blue">Age Rating : ${ageRateFormater(
                  this.#data.ageRate
                )}</span>
                <p class="text">${this.#data.language}</p>
                </li>
                <li class="list">
                <p class="text">State : <span class="tag tag-color-blue">${
                  this.#data.state
                }</span></p>
                </li>
                <li class="list"> 
                <p class="text">${
                  this.#data.type === 'tv' ? 'Episode ' : ''
                }Run Time : ${convertRuntime(this.#data.runTime)}</p>
                </li>
                ${
                  this.#data.episodeNumber
                    ? `
                    <li class="list">
                      <p class="text">
                        Total episodes :
                          ${this.#data.episodeNumber}
                      </p>
                    </li>
                  `
                    : ''
                }
                <li class="text">
                <span class="text">Publish Date : ${this.#data.puplishedDate.replaceAll(
                  '-',
                  '/'
                )}</span>
                </li>
                ${
                  this.#data.lastPublishedDate
                    ? ` <li class="text">
                <span class="text">Last Publish Date : ${this.#data.lastPublishedDate.replaceAll(
                  '-',
                  '/'
                )}</span>
                </li>`
                    : ''
                }
                <li class="list rate">
                <a href=${this.#data.imdbUrl}>
                <img
                    src="${image}"
                    alt="imdb logo"
                    class="logo__img"
                /></a>
                <div class="rate__container">
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
                    <span class="rate__ratio tag star">${Convertnumber(
                      this.#data.imdbRateing
                    )}/10</span>
                    <span class="rate__num">${Convertnumber(
                      this.#data.imdbVoteCount
                    )}</span>
                </div>
                </li>
                <li class="list rate">
                <img
                    src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                    alt="tmdb logo"
                    class="logo__img"
                />
                <div class="rate__container">
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
                    <span class="rate__ratio tag star">${Convertnumber(
                      this.#data.tmdbRateing
                    )}/10</span>
                    <span class="rate__num">${Convertnumber(
                      this.#data.tmdbVoteCount
                    )}</span>
                </div>
                </li>
                <li class="list rate">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Rotten_Tomatoes_logo.svg/1920px-Rotten_Tomatoes_logo.svg.png?20230226041307"
                    alt="rotten tommato logo"
                    class="logo__img"
                />
                <span class="rate__ratio tag rotten">${
                  this.#data.rottenTomatoesRateing
                }</span>
                </li>
                <li class="list tags">
                ${
                  this.#data.genre
                    ?.map(gen => {
                      return `<span class="tag tag-color-blue">${gen.name}</span>`;
                    })
                    .join('') || 'N/A'
                }
                </li>
            </ul>
          </div>
          <div class="overview__container">
              <p class="overview__text">
                  <span class="headline">OverView:</span>${this.#data.overview}
              </p>
            <div class="names">
                <p class="text margin__mid">
                <span class="headline">Stars</span>${
                  this.#data.actors
                    ?.map(
                      obj =>
                        `  <a class="actor__link" href=${obj.url}> ${obj.name} </a> `
                    )
                    .join(',') || 'N/A'
                }
                 </p>
            </div>
            <div class="image__frames__container">
                ${
                  this.#data.imageFrames
                    ?.slice(0, DISPLAY_PER_IMAGE + 1)
                    ?.map(nodeObj =>
                      this.#generateImageFramesMarkup(nodeObj.node)
                    )
                    .join('') || ''
                }
            </div>
          </div>
          <div class="series__container">
            <h2 class="heading__2">Series collaction :</h2>
            <div class="collaction">
              ${
                this.#data.collection
                  ?.map(obj => this.#collactionMarkup(obj))
                  .join('') ||
                this.#data.seasons
                  ?.map(obj => this.#collactionMarkup(obj))
                  .join('') ||
                'No Series for this movie to display.'
              }
             </div>
           </div>
        </div>
    </main>
`;
  }

  #generateImageFramesMarkup(obj) {
    return `
    <a href= ${obj.url} class='imgae-frame__link'>
      <img
      data-src=${obj.url}
      alt="${this.#data.title} image frame"
        class="image__frames lazyload"
      />
    </a>
    `;
  }

  #generateTrailerMarkup() {
    return `
    <div class="overlay">
      <button class="close__btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="close__icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <div class="window">
      <div class="video-container">
       <iframe
          src="https://www.youtube.com/embed/${displayTrailer(
            this.#data.trailers
          )}"
          title="YouTube video player"
          frameborder="0"
          sandbox="allow-same-origin allow-scripts allow-presentation"
          referrerpolicy="no-referrer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
    `;
  }

  #collactionMarkup(obj) {
    return `
    <div class="collaction__element" data-id=${obj.id} data-type=${
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

export default new MovieView();
