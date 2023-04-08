import axios from 'axios';

export class PixabayApi {
    #BASE_URL = 'https://pixabay.com/api/';

    #BASE_SEARCH_PARAMS = {
        key: '19101528-2a830a4e1b687e52e06cd9950',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
    }

    q = '';
    page = 1;
    totalPages = 0;

    pageDetection(totalHits) {
        return Math.ceil(totalHits / this.#BASE_SEARCH_PARAMS.per_page);
        
    }

    checkPages() {
        return this.page < this.totalPages;
    }

    reset() {
        return this.page = 1;
    }

    async fetchPhotos () {
        const searchParams = new URLSearchParams ({
            ...this.#BASE_SEARCH_PARAMS,
            q: this.q,
            page: this.page,
        });

        const { data } = await axios.get(`${this.#BASE_URL}?${searchParams}`);
        return data;
    }
}