import axios from 'axios';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchCards() {
    const KEY = '33112216-e5b097e9371d0df4b0ecc7612';
    const BASE_URL = 'https://pixabay.com/api/';
    const searchOptions =
      'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${searchOptions}&page=${this.page}`
    );

    return response.data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
