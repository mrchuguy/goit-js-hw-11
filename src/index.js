import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let currentPage = 1;
let inputValue = '';
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const params = {
  key: '30688451-760a190d43b2b36afa0e2975a',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};

const renderImages = images => {
  console.log(images);
  refs.gallery.innerHTML = '';
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <a class='gallery__item' href="${largeImageURL}">
          <div class="photo-card">
            <img class='gallery__img' src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                <span>${likes}</span>
              </p>
              <p class="info-item">
                <b>Views</b>
                <span>${views}</span>
              </p>
              <p class="info-item">
                <b>Comments</b>
                <span>${comments}</span>
              </p>
              <p class="info-item">
                <b>Downloads</b>
                <span>${downloads}</span>
              </p>
            </div>
          </div>
        </a>`
    )
    .join('');
  refs.gallery.innerHTML = markup;
  gallery.refresh();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const fetchImages = async () => {
  const response = await axios.get('https://pixabay.com/api/', { params });
  return response;
};

const hadleResponse = response => {
  if (response.data.totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    if (currentPage === 1)
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    renderImages(response.data.hits);
  }
};

const handleEvent = event => {
  event.preventDefault();
  inputValue = event.currentTarget.elements.searchQuery.value.trim();
  if (inputValue !== '') {
    params.q = inputValue;
    params.page = currentPage;
    fetchImages()
      .then(hadleResponse)
      .catch(error => console.log(error.message));
  } else {
    Notify.failure('An empty string has been entered. Please try again.');
  }
};

refs.form.addEventListener('submit', handleEvent);
refs.gallery.addEventListener('click', event => {
  event.preventDefault();
});
const gallery = new SimpleLightbox('.gallery a');
