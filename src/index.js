import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Throttle from 'lodash.throttle';

let currentPage = 1;
let inputValue = '';
let maxPage = 1;

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
  if (currentPage === 1) refs.gallery.innerHTML = '';
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
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
};

const fetchImages = async () => {
  const response = await axios.get('https://pixabay.com/api/', { params });
  return response;
};

const pagination = () => {
  document.removeEventListener('scroll', scrollEvent);
  currentPage++;
  if (currentPage > maxPage) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    genRequest();
  }
};

const scrollEvent = Throttle(() => {
  if (
    refs.gallery.lastElementChild.getBoundingClientRect().top <
    document.documentElement.clientHeight
  )
    pagination();
}, 300);

const genRequest = () => {
  params.q = inputValue;
  params.page = currentPage;
  fetchImages()
    .then(hadleResponse)
    .catch(error => console.log(error.message));
};

const hadleResponse = response => {
  const totalImage = response.data.totalHits;
  if (totalImage === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    if (currentPage === 1) {
      maxPage = totalImage / params.per_page;
      Notify.success(`Hooray! We found ${totalImage} images.`);
    }
    renderImages(response.data.hits);
    document.addEventListener('scroll', scrollEvent);
  }
};

const handleEvent = event => {
  event.preventDefault();
  inputValue = event.currentTarget.elements.searchQuery.value.trim();
  if (inputValue !== '') {
    currentPage = 1;
    genRequest();
  } else {
    Notify.failure('An empty string has been entered. Please try again.');
  }
};

refs.form.addEventListener('submit', handleEvent);
refs.gallery.addEventListener('click', event => {
  event.preventDefault();
});
const gallery = new SimpleLightbox('.gallery a');
