import axios from 'axios';

export default {
    data() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }, 
            url: 'https://soapd-shop-api-587eaeba4c14.herokuapp.com'
        }
    },

    methods: {
        async login(password) {
            try {
                const request = await axios.get(`${this.url}/admin?password=${password}`);
                const response = await request.data;

                return response;
            } catch(error) {
                return {'status': 500, 'message': 'Упс, щось не так з роботою сервера. Спробуйте пізніше!'}
            }
        },

        async goods() {
            try {
                const request = await axios.get(`${this.url}/goods`);
                const response = await request.data;

                return response;
            } catch(error) {
                return {'status': 500, 'message': 'Упс, щось не так з роботою сервера. Спробуйте пізніше!'}
            }
        },

        async addItem(title, sum, images) {
            try {
                const h = this.headers;
                const f = new FormData();
                for(var image of images) {
                    f.append('images', image);
                }

                const request = await axios.post(`${this.url}/goods/item/add?title=${title}&sum=${sum}`, f);
                const response = await request.data;

                return response;
            } catch(error) {
                return {'status': 500, 'message': 'Упс, щось не так з роботою сервера. Спробуйте пізніше!'}
            }
        },

        async updateItem(id, title, sum, images) {
            try {
                const h = this.headers;
                var request;

                if(images !== null) {
                    const f = new FormData();
                    for(var image of images) {
                        f.append('images', image);
                    }

                    request = await axios.put(`${this.url}/goods/update/item/${id}?new_title=${title}&new_fullsum=${sum}`, f);
                } else {
                    request = await axios.put(`${this.url}/goods/update/item/${id}?new_title=${title}&new_fullsum=${sum}`);
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