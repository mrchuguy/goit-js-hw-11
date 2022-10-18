//const axios = require('axios').default;
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
Notify.success('Sol lucet omnibus');

const refs = {
  form: document.querySelector('.search-form'),
};

const isValidInput = e => {
  const inputValue = e.currentTarget.elements.searchQuery.value.trim();
  return inputValue !== '';
};

const fetchImages = async () => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '30688451-760a190d43b2b36afa0e2975a',
        q: '',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 13,
        per_page: 40,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
};

refs.form.addEventListener('submit', event => {
  event.preventDefault();
  if (isValidInput(event)) {
    console.log('request');
    fetchImages();
  } else {
    Notify.failure('An empty string has been entered. Repeat request');
  }
});
