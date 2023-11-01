<template>
  <div v-if="loader === true" class="loader position-fixed mt-4 w-100">
    <div class="d-flex justify-content-center">
      <div class="spinner-grow text-primary mx-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-secondary mx-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-succes mx-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-danger mx-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-warning mx-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-info mx-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>

  <div v-if="auth === null" class="d-flex align-items-center justyfi-content-center" style="height: 100vh;">
    <v-sheet width="300" class="mx-auto">
      <v-form>
        <v-text-field
          v-model="password"
          label="Пароль *"
        ></v-text-field>
        <v-btn type="submit" :color="loginButton.color" block class="mt-2 loginButton" @click.prevent="loginFunc">Увійти</v-btn>
      </v-form>
    </v-sheet>
  </div>

  <div v-if="auth !== null">
    <div v-if="loader === false">
      <v-app>
        <v-app-bar :elevation="2">
          <template v-slot:prepend>
            <v-btn
              @click="this.$router.push({name: 'home'})"
              color="primary"
              title="До головної"
            >
              <v-icon
                icon="mdi-arrow-left"
              ></v-icon>
            </v-btn>
          </template>
          <v-app-bar-title class="fw-bold">Адмінпанель</v-app-bar-title>

          <template v-slot:append>
            <v-btn @click="logout()" icon="mdi-minus-circle" color="red-lighten-2">
              <v-icon
                center
                icon="mdi-minus-circle"
              ></v-icon>
              <v-tooltip activator="parent" location="bottom">Вийти з аккаунту</v-tooltip>
            </v-btn>
          </template>
        </v-app-bar>

        <v-main>
          <div class="table-block border-bottom">
              <v-table class="container">
                <thead>
                  <tr>
                    <th class="text-center fw-bold">
                      Назва товару
                    </th>
                    <th class="text-center fw-bold">
                      ДіЇ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in items[page - 1]" :key="item.id">
                    <td class="text-center">{{ item.title }}</td>
                    <td class="text-center">
                      <div v-if="item.title" class="d-flex align-center justify-center">
                        <v-btn class="m-1" @click="updateForm(item)">📝</v-btn>
                        <v-btn class="m-1" @click="deleteItemFunc(item.title)">
                          <v-icon
                            size="large"
                            color="red-darken-2"
                            icon="mdi-delete-circle"
                          ></v-icon>
                        </v-btn>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <v-dialog
                v-model="updateFormDialog"
                width="auto"
                persistent
              >
                <v-card class="p-4">
                  <v-container class="mb-2">
                   <v-carousel show-arrows="hover" height="160" hide-delimiters cycle>
                      <v-carousel-item
                        v-for="image in item.images"
                        :key="image.id"
                        @click="deleteImageFunc(item.id, image.split('/').pop())"
                        :src='image'
                        height="160"
                      >
                      <v-tooltip activator="parent" location="center">Видалити зображення</v-tooltip>
                      </v-carousel-item>
                    </v-carousel>
                  </v-container>

                  <form enctype="multipart/form-data">
                    <v-text-field
                      type="text"
                      v-model="item.title"
                      label="Назва товару *"
                    ></v-text-field>

                    <v-text-field
                      type="number"
                      min="0"
                      v-model="item.sum"
                      label="Вартість товару *"
                    ></v-text-field>

                    <label for="images-modal">Зображення для товару (jpg, png)</label>
                    <div>
                    <input type="file" class="mb-4 images-modal" multiple="multiple" />
                    </div>
                  </form>
                  <div>
                    <v-btn class="my-2" color="success" block @click="updateItemFunc(item.id)">Оновити</v-btn>
                    <v-btn class="" color="danger" block @click="updateFormDialogClose">Закрити модалку</v-btn>
                  </div>
                </v-card>
              </v-dialog>

              <v-pagination v-model="page" :length="items.length" class="mt-5"></v-pagination>
          </div>

          <div class="d-flex align-center justify-center h-50 create-block">
            <div class="mx-5 my-5 col-lg-6 shadow-lg p-3">
                <h2 class="text-body-emphasis text-center mb-3">Додати новий товар</h2>
                <form enctype="multipart/form-data">
                  <v-text-field
                    type="text"
                    v-model="item.title"
                    label="Назва товару *"
                  ></v-text-field>

                  <v-text-field
                    type="number"
                    min="0"
                    v-model="item.sum"
                    label="Вартість товару *"
                  ></v-text-field>

                  <label for="images">Зображення для товару (jpg, png) *</label>
                  <div>
                    <input type="file" class="mb-4 images" multiple="multiple" />
                  </div>

                  <div class="d-flex justify-center align-center">
                    <v-btn
                      class="m-1"
                      @click.prevent="add"
                    >
                      Додати
                    </v-btn>

                    <v-btn @click="handleReset" class="m-1">
                      Скинути
                    </v-btn>
                  </div>
                </form>
            </div>
          </div>
        </v-main>
      </v-app>
    </div>  
  </div>
</template>

<script>
  import $ from 'jquery';
  import login from '../mixins/api.js';
  import goods from '../mixins/api.js';
  import addItem from '../mixins/api.js';
  import updateItem from '../mixins/api.js';
  import deleteImage from '../mixins/api.js';
  import deleteItem from '../mixins/api.js';
  import toastr from 'toastr';
  import 'toastr/toastr.scss';

  export default {
    name: 'Admin',
    mixins: [login, goods],
    data() {
      return {
        url: 'https://soapd-shop-api-587eaeba4c14.herokuapp.com',
        updateFormDialog: false,
        item: {
          id: null,
          title: '',
          sum: '',
          images: null
        },
        page: 1,
        items: [],
        auth: null,
        loader: false,
        loginButton: {
          color: 'light'
        },
        password: ''
      }
    },
    mounted() {
      this.auth = localStorage.getItem('admin');

      toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
        timeOut: 2500,
        toastClass: 'custom-toast',
      };

      if(this.auth !== null) {
        this.goodsFunc();
      }
    },
    methods: {
      async loginFunc() {
        var loginButton = document.querySelector('.loginButton');
        loginButton.disabled = true;
        this.loader = true;
        var error_r = false;

        if(this.password.replaceAll(' ', '').length === 0) {
          error_r = true;
          this.loginButton.color = 'danger';
          setTimeout(() => {
            this.loginButton.color = 'light';
          }, 1000)
        } else {
          try {
            const request = await this.login(this.password);
            if(request['status'] === 200) {
              localStorage.setItem('admin', true);
              this.auth = true;
              this.goodsFunc();
            } else {
              const message = request['message'];
              toastr.error(message)
              error_r = true;
            }
          } catch(error) {
            toastr.error(error)
            error_r = true;
          }
        }

        if(error_r === true) {
          loginButton.disabled = false;
          this.loader = false;
        }
      },

      async goodsFunc() {
        this.loader = true;
        var finished = false;

        try {
          this.items = [];
          this.handleReset();
          const request = await this.goods();
          if(request['status'] === 200) {
            this.items = request['message'];
            finished = true;
          } else {
            toastr.error(request['message'])
            finished = true;
          }
        } catch(error) {
          toastr.error('Упс, щось не так з роботою сервера. Спробуйте пізніше!')
          finished = true;
        }

        if(finished === true) {
          this.loader = false;
        }
      },

      handleReset(page=null) {
        this.item.id = null;
        this.item.title = '';
        this.item.sum = '';
        this.updateFormDialog = false;

        if(page === null) {
          this.page = 1;
        }
        
        if(document.querySelector('.images')) {
          document.querySelector('.images').value = null;
        } 

        if(document.querySelector('.images-modal')) {
          document.querySelector('.images-modal').value = null;
        }
      },

      async add() {
        var images = document.querySelector('.images');
        var error_r = false;

        if(this.item.title.replaceAll(' ', '').length !== 0 && this.item.sum.length !== 0 && images.files.length > 0) {
          this.loader = true;
          try {
            const request = await this.addItem(this.item.title, this.item.sum, images.files);
            if(request['status'] === 200) {
              this.goodsFunc();
            } else {
              toastr.error(request['message'])
              this.loader = false;
              error_r = true;
            }
          } catch(error) {
            toastr.error('Упс, щось не так з роботою сервера. Спробуйте пізніше!')
            this.loader = false;
            error_r = true;
          }
        } else {
          toastr.error("Заповніть усі поля відмічені '*'!");
        }

        if(error_r === true) {
          this.loader = false;
        }
      },

      updateForm(item) {
        this.item.title = item.title;
        this.item.sum = item.sum;
        this.item.id = item.title;
        this.updateFormDialog = true;

        this.item.images = item.images.split(', ');
        this.item.images = this.item.images.map(e => `${this.url}/goods/image/${e}`)
      },

      updateFormDialogClose() {
        this.handleReset(this.page);
        this.updateFormDialog = false;
      },

      async updateItemFunc(id) {
        var images = document.querySelector('.images-modal');
        var error_r = false;
        
        if(this.item.title.replaceAll(' ', '').length !== 0 && this.item.sum.length !== 0) {
          this.loader = true;
          try {
            var request;
            if(images.files.length > 0) {
              request = await this.updateItem(this.item.id, this.item.title, this.item.sum, images.files);
            } else {
              request = await this.updateItem(this.item.id, this.item.title, this.item.sum, null);
            }

            if(request['status'] === 200) {
              this.goodsFunc();
            } else {
              toastr.error(request['message']);
              error_r = true;
            }
          } catch(error) {
            toastr.error('Упс, щось не так з роботою сервера. Спробуйте пізніше!');
            error_r = true;
          }

          if(error_r === true) {
            this.loader = false;
          }
        } else {
          toastr.error("Заповніть усі поля відмічені '*'!");
        }
      },

      async deleteImageFunc(id, filename) {
        this.loader = true;
        var error_r = false;

        try {
          const request = await this.deleteImage(id, filename);
          if(request['status'] === 200) {
            this.goodsFunc();
          } else {
            toastr.error(request['message']);
            error_r = true;
          }
        } catch(error) {
          toastr.error('Упс, щось не так з роботою сервера. Спробуйте пізніше!')
          error_r = true;
        }

        if(error_r === true) {
          this.loader = false;
        }
      },

      async deleteItemFunc(title) {
        this.loader = true;
        var error_r = false;
        try {
          const request = await this.deleteItem(title);
          if(request['status'] === 200) {
            await this.goodsFunc();
          } else {
            toastr.error(request['message']);
            error_r = true;
          }
        } catch(error) {
          toastr.error('Упс, щось не так з роботою сервера. Спробуйте пізніше!');
          error_r = true;
        }

        if(error_r === true) {
          this.loader = false;
        }
      },

      logout(){
        localStorage.removeItem('admin');
        this.password = '';
        this.auth = null;
      }
    },
  }
</script>

<style>
  #app {
    height: 100vh;
  }

  .v-container--fluid {
    max-height: 160px;
    overflow: auto;
  }

  .v-table {
    max-height: 350px;
    overflow: auto;
  }

  .create-block {
    min-height: 494px !important;
  }
</style>
