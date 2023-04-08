import { PixabayApi } from './js/pixabayapi';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import {createElements} from './js/markup'


const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');
const btnLoad = document.querySelector('.btnload');
btnLoad.style.display = 'none';

const lightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250
  });

let data;
const pixabayApi = new PixabayApi();

form.addEventListener('submit', handleFormSubmit);
btnLoad.addEventListener('click', handleLoadMore);


function reset() {
  pixabayApi.reset();
  gallery.innerHTML = '';
  btnLoad.style.display = 'none';
}




async function handleFormSubmit(e) {
  e.preventDefault(); 
  const searchQuery = e.target.elements['searchQuery'].value.toLowerCase().trim(); //значення інпут записуємо у змінну

  if (searchQuery === '') {
    reset();
    return Notiflix.Notify.failure(
      'Please, enter your request.'
    );
  }

  pixabayApi.q = searchQuery;
  try {

   reset();
   const data = await pixabayApi.fetchPhotos();

    updateGallery(data);


    e.target.elements['search-bar'].value = '';
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong! An error!');
    reset();
  }


}



function updateGallery(data) {

  if (!data.hits.length) {
     Notiflix.Notify.failure(
      'Sorry, there are no images matching on your request. Please try again.'
     );
    reset();
    return;
  }
  gallery.insertAdjacentHTML('beforeend', createElements(data.hits));
  lightBox.refresh();

  pixabayApi.totalPages = pixabayApi.pageDetection(data.totalHits);


  if (!pixabayApi.checkPages()) {

    btnLoad.style.display = 'none';
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");

  } else {
    btnLoad.style.display = 'block';
    Notiflix.Notify.success(`'Hooray! We found ${data.totalHits} images.'`);
  }

}

async function handleLoadMore() {

  try {
  pixabayApi.page += 1;
   const data = await pixabayApi.fetchPhotos();
updateGallery(data);
  } catch (error) {
    Notify.failure('Error! Something went wrong!');

    reset();
    return;
  }

const newElements = createElements(data.results);
  gallery.insertAdjacentHTML('beforeend', newElements);
  lightBox.refresh();

}