import PixabayApiService from './ApiService';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

const apiService = new PixabayApiService();

form.addEventListener('submit', onSearch);
loadBtn.addEventListener('click', onLoadMore);

loadBtn.hidden = true;

function onSearch(evt) {
  evt.preventDefault();

  apiService.query = evt.currentTarget.elements.searchQuery.value;
  apiService
    .fetchCards()
    .then(data => {
      console.log(data);
      cardsMarkup(data.hits);

      loadBtn.hidden = false;

      if (data.total > 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
      }

      if (data.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadBtn.hidden = true;
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
        `<div class="gallery">
     <a href="${largeImageURL}">
     <img src="${webformatURL}" alt="${tags}" />
    </a>
  </div>
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

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function onLoadMore() {
  apiService.fetchCards().then(data => {
    apiService.incrementPage();
    cardsMarkup(data.hits);

    if (data.totalHits === data.total) {
      loadBtn.hidden = true;
    }
  });
}
