import { createStore } from 'vuex';

const store = createStore({
  state: {
    url: 'https://soapd-shop-api-587eaeba4c14.herokuapp.com'
  },
  getters: {
    getUrl: (state) => state.url
  }
});

export default store;
