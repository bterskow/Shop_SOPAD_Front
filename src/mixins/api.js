import axios from 'axios';

export default {
    data() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }, 
            url: this.$store.getters.getUrl
        }
    },

    methods: {
        api() {
            return this.url;
        },

        async login(password) {
            try {
                const request = await axios.get(`${this.url}/admin?password=${password}`);
                const response = await request.data;

                return response;
            } catch(error) {
                return {'status': 500, 'message': 'Упс, щось не так з роботою сервера. Спробуйте пізніше!'}
            }
        },

        async goods(category=null, subcategory=null) {
            try {
                var request;
                if(category !== null) {
                    if(subcategory !== null) {
                        request = await axios.get(`${this.url}/goods?category=${category}&subcategory=${subcategory}`);
                    } else {
                        request = await axios.get(`${this.url}/goods?category=${category}`);
                    }
                } else {
                    request = await axios.get(`${this.url}/goods`);
                }

                const response = await request.data;

                return response;
            } catch(error) {
                return {'status': 500, 'message': 'Упс, щось не так з роботою сервера. Спробуйте пізніше!'}
            }
        },

        async addItem(title, description, category, subcategory, sum, images) {
            try {
                const h = this.headers;
                const f = new FormData();
                for(var image of images) {
                    f.append('images', image);
                }

                var request;
                if(subcategory !== null) {
                    request = await axios.post(`${this.url}/goods/item/add?title=${title}&description=${description}&category=${category}&sum=${sum}&subcategory=${subcategory}`, f);
                } else {
                    request = await axios.post(`${this.url}/goods/item/add?title=${title}&description=${description}&category=${category}&sum=${sum}`, f);
                }

                const response = await request.data;

                return response;
            } catch(error) {
                return {'status': 500, 'message': 'Упс, щось не так з роботою сервера. Спробуйте пізніше!'}
            }
        },

        async updateItem(id, title, description, category, subcategory, sum, images) {
            try {
                const h = this.headers;
                var request;

                if(images !== null) {
                    const f = new FormData();
                    for(var image of images) {
                        f.append('images', image);
                    }

                    if(subcategory !== null) {
                        request = await axios.put(`${this.url}/goods/update/item/${id}?new_title=${title}&new_description=${description}&new_category=${category}&new_subcategory=${subcategory}&new_fullsum=${sum}`, f);
                    } else {
                        request = await axios.put(`${this.url}/goods/update/item/${id}?new_title=${title}&new_description=${description}&new_category=${category}&new_fullsum=${sum}`, f);
                    }   
                } else {
                    if(subcategory !== null) {
                        request = await axios.put(`${this.url}/goods/update/item/${id}?new_title=${title}&new_description=${description}&new_category=${category}&new_subcategory=${subcategory}&new_fullsum=${sum}`);
                    } else {
                        request = await axios.put(`${this.url}/goods/update/item/${id}?new_title=${title}&new_description=${description}&new_category=${category}&new_fullsum=${sum}`);
                    }  
                }

                const response = await request.data;

                return response;
            } catch(error) {
                return {'status': 500, 'message': 'Упс, щось не так з роботою сервера. Спробуйте пізніше!'}
            }
        },

        async deleteImage(id, filename) {
            try {
                const request = await axios.get(`${this.url}/goods/delete/${id}/${filename}`);
                const response = await request.data;

                return response;
            } catch(error) {
                return {'status': 500, 'message': 'Упс, щось не так з роботою сервера. Спробуйте пізніше!'}
            }
        },

        async deleteItem(title) {
            try {
                const request = await axios.delete(`${this.url}/goods/delete/item/${title}`);
                const response = await request.data;

                return response;
            } catch(error) {
                return {'status': 500, 'message': 'Упс, щось не так з роботою сервера. Спробуйте пізніше!'}
            }
        },

        async notification(task, dict) {
            try {
                const h = this.headers;
                const request = await axios.post(`${this.url}/admin/order/notification/${task}`, dict);
                const response = await request.data;

                return response;
            } catch(error) {
                return {'status': 500, 'message': 'Упс, щось не так з роботою сервера. Спробуйте пізніше!'}
            }
        }
    }
}