import { languagesWords } from './config';

export const getJson = async function (url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export const getLanguage = function (lang) {
  return languagesWords[lang] || lang || 'N/A';
};

export const convertRuntime = function (min) {
  if (min === 'N/A') return 'N/A';
  let minutes = parseInt(min);
  if (typeof minutes === 'object') {
    minutes = minutes.lenght === 0 ? 'N/A' : minutes[0];
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  return `${hours}h ${remainingMinutes}m`;
};

export const ageRateFormater = function (ageRate) {
  if (typeof ageRate === 'boolean') return ageRate === true ? 'NC-17' : 'G';
  return ageRate;
};

export const Convertnumber = function (num) {
  if (num === 'N/A') return 0;
  const numInt = Number(`${num}`.replaceAll(',', ''));
  if (numInt === 'N/A' || numInt === '0' || numInt === 0) return 0;
  if (numInt > 10 && numInt < 1000) return numInt;
  if (numInt >= 1000000) return `${(numInt / 1000000).toFixed(1)}M`;
  if (numInt >= 1000) return `${(numInt / 1000).toFixed(1)}K`;
  if (numInt <= 10) return numInt.toFixed(1);
};

export const displayTrailer = function (results) {
  if (results.length === 0) return null;

  const trailersArr = results.filter(obj =>
    obj.type.toLowerCase().includes('trailer')
  );
  if (trailersArr.length === 0) {
    const teaserArr = results.filter(obj =>
      obj.type.toLowerCase().includes('teaser')
    );
    if (teaserArr.length === 0) return null;

    return getObj(teaserArr);
  }
  return getObj(trailersArr);
};

const getObj = function (arr) {
  if (arr.length === 1) return arr[0].key;

  const obj = arr.reduce((acc, cur) => {
    const [curYear, curMonth, curday] = cur.published_at
      .split('T')[0]
      .split('-');
    const [accYear, accMonth, accday] = acc.published_at
      .split('T')[0]
      .split('-');

    if (curYear === accYear) {
      if (curMonth === accMonth) return curday > accday ? cur : acc;
      return curMonth > accMonth ? cur : acc;
    }
    return curYear > accYear ? cur : acc;
  }, arr[0]);

  return obj.key;
};
