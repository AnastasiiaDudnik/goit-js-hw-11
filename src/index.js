import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
let page = 1;

form.addEventListener('submit', onSearch);
// loadBtn.addEventListener('click', onLoadMore);

loadBtn.hidden = true;

async function fetchCards(query) {
  const KEY = '33112216-e5b097e9371d0df4b0ecc7612';
  const BASE_URL = 'https://pixabay.com/api/';

  const response = await axios.get(
    `${BASE_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );

  return response.data;
}

function onSearch(evt) {
  evt.preventDefault();

  const searchQuery = evt.currentTarget.elements.searchQuery.value;
  if (!searchQuery) {
    gallery.innerHTML = '';
    return;
  }

  console.log(searchQuery);

  fetchCards(searchQuery)
    .then(data => {
      console.log(data);
      cardsMarkup(data.hits);
      loadBtn.hidden = false;

      if (data.total > 0) {
        Notiflix.Notify.success(
          `Hooray! We found ${data.totalHits} images of "${searchQuery}"`
        );
      }

      if (data.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function cardsMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
