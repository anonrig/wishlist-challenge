import axios from 'axios';


class API {
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8080/v1',
      timeout: 30000,
      responseType: 'json'
    });
  }

  getInstance() {
    return this.instance;
  }

  getAllItems() {
    return this.instance
      .get('/wishlist')
      .then(response => response.data);
  }

  add(payload) {
   return this.instance
      .post('/wishlist', payload)
      .then(response => response.data);
  }

  remove(id) {
   return this.instance
      .delete(`/wishlist/${id}`)
      .then(response => response.data);
  }

  search(keyword) {
    return this.instance
      .get('/wishlist/search', {
        params: {keyword}
      })
      .then(response => response.data);
  }
}

export default new API();
