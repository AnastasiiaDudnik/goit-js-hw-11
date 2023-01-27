import PixabayApiService from './ApiService';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const guard = document.querySelector('.js-guard');

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};

const apiService = new PixabayApiService();

let observer = new IntersectionObserver(onLoad, options);

form.addEventListener('submit', onSearch);
loadBtn.addEventListener('click', onLoadMore);

loadBtn.hidden = true;

function onSearch(evt) {
  evt.preventDefault();

  apiService.query = evt.currentTarget.elements.searchQuery.value;
  apiService.resetPage();

  apiService.fetchCards().then(data => {
    clearGallery();
    cardsMarkup(data.hits);
    observer.observe(guard);
    apiService.incrementPage();

    // loadBtn.hidden = false;

    if (data.total > 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
    }

    if (data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadBtn.hidden = true;
    }
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
          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
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

function onLoadMore() {
  apiService
    .fetchCards()
    .then(data => {
      cardsMarkup(data.hits);

      if (data.totalHits === data.total) {
        loadBtn.hidden = true;
        Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
      }
    })
    .catch(err => console.log(err));
}

function clearGallery() {
  gallery.innerHTML = '';
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      apiService.incrementPage();
      apiService
        .fetchCards()
        .then(data => {
          cardsMarkup(data.hits);

          if (data.totalHits === data.total) {
            Notiflix.Notify.info(
              `We're sorry, but you've reached the end of search results.`
            );
            observer.unobserve(guard);
          }
        })
        .catch(err => console.log(err));
    }
  });
}
