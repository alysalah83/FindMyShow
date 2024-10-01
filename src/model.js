import { getJson, getLanguage } from './helper';

export const state = {
  movie: {},
  tvShow: {},
  results: [],
  bookmarks: [],
};

export const resultsData = async function (query) {
  const dataResults = await getJson(
    `https://api.themoviedb.org/3/search/multi?api_key=e9205f098fab4bfd79d0bf1abbfb3a54&query=${query}`
  );
  state.results = dataResults.results;
};

export const getData = async function (id, type) {
  const data1 = await getJson(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=e9205f098fab4bfd79d0bf1abbfb3a54&append_to_response=videos,images`
  );
  console.log(data1);

  let imdbId = data1.imdb_id;
  if (!imdbId) {
    const ids = await getJson(
      `https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=e9205f098fab4bfd79d0bf1abbfb3a54`
    );
    imdbId = ids?.imdb_id;
  }
  const [{ value: data2 }, { value: data3 }] = await Promise.allSettled([
    getJson(`https://www.omdbapi.com/?apikey=c8d24f0b&i=${imdbId}`),
    getJson(`https://imdb.iamidiotareyoutoo.com/search?tt=${imdbId}`),
  ]);

  console.log(data2, data3);
  if (type === 'movie')
    state.movie = {
      image: data1.poster_path || data1.backdrop_path,
      title: data1.title,
      state: data1.status,
      ageRate:
        data3.short?.contentRating ?? data2?.Rated ?? data1.adult ?? 'N/A',
      language: getLanguage(data1.original_language),
      runTime: data1.runtime || 'N/A',
      puplishedDate: data1.release_date || 'N/A',
      imdbUrl: `https://www.imdb.com/title/${imdbId}/`,
      imdbRateing:
        data3.top?.ratingsSummary.aggregateRating || data2?.imdbRating || '0',
      imdbVoteCount:
        data3.top?.ratingsSummary.voteCount || data2?.imdbVotes || '0',
      tmdbRateing: data1.vote_average,
      tmdbVoteCount: data1.vote_count,
      rottenTomatoesRateing: data2?.Ratings?.[1]?.Value || 'N/A',
      genre: data1.genres,
      overview: data1.overview || 'N/A',
      actors: data3.short?.actor,
      imageFrames: data3.main?.titleMainImages.edges,
      trailers: data1.videos.results,
      collectionId: data1.belongs_to_collection?.id || null,
      type,
      id,
      bookmarked: false,
    };

  if (state.bookmarks.some(obj => obj.id === state.movie.id))
    state.movie.bookmarked = true;

  if (state.movie.collectionId) {
    const data = await getJson(
      `https://api.themoviedb.org/3/collection/${state.movie.collectionId}?&language=en-US&api_key=e9205f098fab4bfd79d0bf1abbfb3a54`
    );
    state.movie.collection = data.parts;
  }

  if (type === 'tv')
    state.tvShow = {
      image: data1.poster_path || data1.backdrop_path,
      title: data1.name,
      state: data1.status,
      ageRate:
        data3.short?.contentRating ?? data2?.Rated ?? data1.adult ?? 'N/A',
      language: getLanguage(data1.original_language),
      runTime:
        data3.main?.runtime?.seconds / 60 || data1.episode_run_time.length === 0
          ? data2?.Runtime
          : data1.episode_run_time || 'N/A',
      puplishedDate: data1.first_air_date || 'N/A',
      lastPublishedDate: data1.last_air_date || 'N/A',
      imdbUrl: `https://www.imdb.com/title/${imdbId}/`,
      imdbRateing:
        data3.top?.ratingsSummary.aggregateRating || data2?.imdbRating || '0',
      imdbVoteCount:
        data3.top?.ratingsSummary.voteCount || data2?.imdbVotes || '0',
      tmdbRateing: data1.vote_average,
      tmdbVoteCount: data1.vote_count,
      rottenTomatoesRateing: data2?.Ratings?.[1]?.Value || 'N/A',
      genre: data1.genres,
      overview: data1.overview || 'N/A',
      actors: data3.short?.actor,
      imageFrames: data3.main?.titleMainImages.edges,
      trailers: data1.videos.results,
      seasons: data1.seasons,
      episodeNumber: data1.number_of_episodes,
      type,
      id,
      bookmarked: false,
    };
  if (state.bookmarks.some(obj => obj.id === state.tvShow.id))
    state.tvShow.bookmarked = true;
  console.log(state.tvShow, state.movie);
};

export const addBookmark = function (data) {
  if (data.bookmarked) return;
  data.bookmarked = true;
  if (state.bookmarks.some(d => data === d)) return;
  state.bookmarks.push(data);
  savingLocalStorge(state.bookmarks);
};

export const removeBookmark = function (data) {
  if (!data.bookmarked) return;
  data.bookmarked = false;
  state.bookmarks.splice(
    state.bookmarks.findIndex(obj => obj.id === data.id),
    1
  );
  savingLocalStorge(state.bookmarks);
};

const savingLocalStorge = function (data) {
  localStorage.setItem('bookmark', JSON.stringify(data));
};

export const loadBookmarks = function () {
  const strData = localStorage.getItem('bookmark');
  const data = JSON.parse(strData);
  if (!data) return;
  state.bookmarks = data;
};
