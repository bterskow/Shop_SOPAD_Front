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
                        <v-btn class="m-1" @click="trash_alert = true">
                          <v-icon
                            size="large"
                            color="red-darken-2"
                            icon="mdi-delete-circle"
                          ></v-icon>
                        </v-btn>
                        <v-dialog width="400" v-model="trash_alert">
                          <v-card>
                            <v-card-text class="text-center">
                              Ви впевнені, що бажаєте видалити {{ item.title }}?
                            </v-card-text>

                            <v-card-actions>
                              <v-spacer></v-spacer>

                              <v-btn
                                text="Так"
                                @click="deleteItemFunc(item.title)"
                              ></v-btn>
                              <v-btn
                                text="Ні"
                                @click="trash_alert = false"
                              ></v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
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
                        @click="trash_alert = true"
                        :src='image'
                        height="160"
                      >
                      <v-tooltip activator="parent" location="center">Видалити зображення</v-tooltip>

                      <v-dialog width="400" v-model="trash_alert">
                        <v-card>
                          <v-card-text class="text-center">
                            Ви впевнені, що бажаєте видалити це зображення?
                          </v-card-text>

                          <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                              text="Так"
                              @click="deleteImageFunc(item.id, image.split('/').pop())"
                            ></v-btn>
                            <v-btn
                              text="Ні"
                              @click="trash_alert = false"
                            ></v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      </v-carousel-item>
                    </v-carousel>
                  </v-container>

                  <form enctype="multipart/form-data">
                    <v-text-field
                      class="mb-3"
                      type="text"
                      v-model="item.title"
                      label="Назва товару *"
                    ></v-text-field>

                    <v-text-field
                      class="mb-3"
                      type="number"
                      min="0"
                      v-model="item.sum"
                      label="Вартість товару *"
                    ></v-text-field>

                    <v-textarea
                      class="mb-3"
                      v-model="item.description"
                      label="Опис товару *"
                      no-resize
                      rows="1"
                    ></v-textarea>

                    <v-select
                      class="mb-3"
                      v-model='item.category'
                      label="Виберіть категорію товару *"
                      :items="item.categories_list['main_categories']"
                      item-title="s"
                      item-value="v"
                      persistent-hint
                      return-object
                      single-line
                    ></v-select>

                    <v-select
                      class="mb-3"
                      v-model='item.subcategory'
                      label="Виберіть підкатегорію"
                      :items='item.categories_list[item.category.subtitle]'
                      item-title="s"
                      item-value="v"
                      persistent-hint
                      return-object
                      single-line
                      no-data-text="(Порожньо)"
                    ></v-select>

                    <label for="images-modal">Зображення для товару (jpg, png)</label>
                    <div>
                    <input type="file" class="mb-4 images-modal" multiple="multiple" />
                    </div>
                  </form>
                  <div>
                    <v-btn class="my-2" color="success" block @click="updateItemFunc(item.id)">Оновити</v-btn>
                    <v-btn class="text-white" color="danger" block @click="updateFormDialogClose">Закрити модалку</v-btn>
                  </div>
                </v-card>
              </v-dialog>

              <v-pagination v-model="page" :length="items.length" class="mt-5"></v-pagination>
          </div>

          <div class="d-flex m-4 align-center justify-center h-50 create-block">
            <div class="mx-5 col-lg-8 col-md-10 col-sm-10 shadow-lg p-3">
                <h2 class="text-body-emphasis text-center mb-3">Додати новий товар</h2>
                <form enctype="multipart/form-data">
                  <v-text-field
                    class="mb-3"
                    type="text"
                    v-model="item.title"
                    label="Назва товару *"
                  ></v-text-field>

                  <v-text-field
                    class="mb-3"
                    type="number"
                    min="0"
                    v-model="item.sum"
                    label="Вартість товару *"
                  ></v-text-field>

                  <v-textarea
                    class="mb-3"
                    v-model="item.description"
                    label="Опис товару *"
                    no-resize
                    rows="1"
                  ></v-textarea>

                  <v-select
                    class="mb-3"
                    v-model='item.category'
                    label="Виберіть категорію товару *"
                    :items="item.categories_list['main_categories']"
                    item-title="s"
                    :item-value="v"
                    persistent-hint
                    return-object
                    single-line
                  ></v-select>

                  <v-select
                    class="mb-3"
                    v-model='item.subcategory'
                    label="Виберіть підкатегорію"
                    :items='item.categories_list[item.category.subtitle]'
                    item-title="s"
                    item-value="v"
                    persistent-hint
                    return-object
                    single-line
                    no-data-text="(Порожньо)"
                  ></v-select>

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
  import login from '@/mixins/api.js';
  import goods from '@/mixins/api.js';
  import addItem from '@/mixins/api.js';
  import updateItem from '@/mixins/api.js';
  import deleteImage from '@/mixins/api.js';
  import deleteItem from '@/mixins/api.js';
  import toastr from 'toastr';
  import 'toastr/toastr.scss';
  import categories_list from '@/mixins/categories.js';

  export default {
    name: 'Admin',
    mixins: [login, goods, addItem, updateItem, deleteImage, deleteItem, categories_list],
    data() {
      return {
        url: this.$store.getters.getUrl,
        updateFormDialog: false,
        item: {
          id: null,
          title: '',
          description: '',
          category: {s: 'Виберіть категорію *', v: null},
          subcategory: {s: 'Виберіть підкатегорію', v: null},
          sum: '',
          images: null,
          categories_list: null
        },
        page: 1,
        items: [],
        auth: null,
        loader: false,
        loginButton: {
          color: 'light'
        },
        password: '',
        trash_alert: false
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
        this.item.categories_list = this.categories_list();
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

      async goodsFunc(page=null) {
        this.loader = true;
        var finished = false;

        try {
          this.items = [];
          this.handleReset(page);
          const request = await this.goods();
          if(request['status'] === 200) {
            this.items = request['message'];
          } else {
            toastr.error(request['message']);
          }
        } catch(error) {
          toastr.error('Упс, щось не так з роботою сервера. Спробуйте пізніше!')
        }

        this.loader = false;
      },

      handleReset(page=null) {
        this.item.id = null;
        this.item.title = '';
        this.item.description = '';
        this.item.category = {s: 'Виберіть категорію *', v: null};
        this.item.subcategory = {s: 'Виберіть підкатегорію', v: null};
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

        if(this.item.title.replaceAll(' ', '').length !== 0 && this.item.description.replaceAll(' ', '').length !== 0 && this.item.category.v !== null && this.item.sum.length !== 0 && images.files.length > 0) {
          this.loader = true;
          try {
            const request = await this.addItem(this.item.title, this.item.description, this.item.category.v, this.item.subcategory.v, this.item.sum, images.files);
            if(request['status'] === 200) {
              this.goodsFunc();
            } else {
              toastr.error(request['message'])
              error_r = true;
            }
          } catch(error) {
            toastr.error('Упс, щось не так з роботою сервера. Спробуйте пізніше!');
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
        this.item.categories_list['main_categories'].forEach((c) => {
          if(c.v == item.category) {
            this.item.category = c;
          }
        })

        if(this.item.category.subtitle) {
          this.item.categories_list[this.item.category.subtitle].forEach((s) => {
            if(s.v == item.subcategory) {
              this.item.subcategory = s;
            }
          })
        }

        this.item.title = item.title;
        this.item.description = item.description;
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
        
        if(this.item.title.replaceAll(' ', '').length !== 0 && this.item.sum.length !== 0 && this.item.description.replaceAll(' ', '').length !== 0 && this.item.category.v !== null) {
          this.loader = true;
          try {
            var request;
            if(images.files.length > 0) {
              request = await this.updateItem(this.item.id, this.item.title, this.item.description, this.item.category.v, this.item.subcategory.v, this.item.sum, images.files);
            } else {
              request = await this.updateItem(this.item.id, this.item.title, this.item.description, this.item.category.v, this.item.subcategory.v, this.item.sum, null);
            }

            if(request['status'] === 200) {
              this.goodsFunc(this.page);
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
        this.trash_alert = false;

        try {
          const request = await this.deleteImage(id, filename);
          if(request['status'] === 200) {
            this.goodsFunc(this.page);
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
        this.trash_alert = false;
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
    min-height: 565px !important;
  }
</style>
