<template>
  <v-app>
    <Header :company="company" :allGoods="items" :ifActive="ifActive" :categories_list="categories" />

    <v-main>
      <div v-if="loader === true" class="loader h-100 d-flex align-items-center justify-content-center">
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

      <div v-if="loader === false" class="content d-block bg-light">
        <div class="dropdown position-fixed d-none d-md-block end-0 bottom-0 m-1 bd-mode-toggle up-button-modal">
          <v-btn class="bg-danger" icon="mdi-arrow-up" @click="up"></v-btn>
        </div>

        <div class="dropdown position-fixed d-block d-md-none bottom-0 m-1 bd-mode-toggle phone-button-modal">
          <v-btn class="bg-danger" icon="mdi-phone" @click="callback.modal = true;"></v-btn>
          <v-dialog
            v-model="callback.modal"
            width="auto"
          >
            <v-card>
              <v-card-actions class="justify-end">
                <v-btn
                  color="black"
                  variant="text"
                  @click.prevent="callback.modal = false;"
                  icon="mdi-close"
                >
                </v-btn>
              </v-card-actions>

              <hr class="m-0 p-0" />

              <CallbackForm :callback="callback" :notificationFunc="notificationFunc" :isValidEmail="isValidEmail"  :isValidPhoneNumber="isValidPhoneNumber" />
            </v-card>
          </v-dialog>
        </div>

        <div class="row shadow border-bottom border-1 border-grey">
          <div class="pa-0 col-md-6 border-right border-2 border-black">
            <v-sheet>
              <v-carousel show-arrows="hover" hide-delimiters cycle>
                <v-carousel-item
                  :src="slider.first"
                  cover
                >
                </v-carousel-item>

                <v-carousel-item
                  :src="slider.second"
                  cover
                >
                </v-carousel-item>

                <v-carousel-item
                  :src="slider.third"
                  cover
                >
                </v-carousel-item>
              </v-carousel>
            </v-sheet>
          </div>
          <div class="col-md-6 d-none d-md-flex pa-0 justify-center align-center callback">
            <v-sheet class="rounded shadow-lg">
              <CallbackForm :callback="callback" :notificationFunc="notificationFunc" :isValidEmail="isValidEmail"  :isValidPhoneNumber="isValidPhoneNumber" />
            </v-sheet>
          </div>
        </div>

        <div class="actions border-bottom border-end p-3 shadow">
          <div class="d-flex flex-column flex-sm-row w-100 gap-2">
            <v-select
              class=""
              v-model='category'
              label="Вибреіть категорію"
              :items="categories"
              item-title="s"
              item-value="v"
              persistent-hint
              return-object
              single-line
            ></v-select>
            <v-btn height="56" @click.prevent="goodsFunc(category.v)">
              <v-icon
                size="large"
                icon="mdi-magnify"
              ></v-icon>
            </v-btn>
            <v-btn height="56" @click.prevent="goodsFunc(null)">
              <v-icon
                size="large"
                icon="mdi-close-circle-outline"
              ></v-icon>
            </v-btn>
          </div>
        </div>

        <div id="goods" class="goods container mt-5">
          <div class="row text-center">
            <div class="col-lg-4" v-for="el in items[page - 1]" :key="el.id">
              <div v-if="el.title">
                <div class="card mb-4 rounded-3 shadow-sm">
                  <!-- <div class="card-header py-3">
                    <h4 class="my-0 fw-normal">{{ el.title }}</h4>
                  </div> -->
                  <div class="card-body">
                    <div class="header border-bottom d-block"><h4 class="card-title pricing-card-title">{{ el.title }}</h4> <span>({{ el.sum }} ₴)</span></div>
                    <v-sheet class="my-4">
                      <div class="item-description">
                        {{ el.description.length > 42 ? el.description.substr(0, 29) + '...' : el.description}}
                        <v-tooltip activator="parent" width="300" location="bottom">{{ el.description }}</v-tooltip>
                      </div>
                      <v-carousel show-arrows="hover" class="p-0 m-0" hide-delimiters height="375">
                        <v-carousel-item
                          v-for="image in el.images.split(', ')"
                          :src="`${url}/goods/image/${image}`"
                        >
                        </v-carousel-item>
                      </v-carousel>
                    </v-sheet>
                    <v-btn type="button" :color="el.color" class="w-100" @click="toBucket(el);">{{ el.buttonText }}</v-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <v-pagination v-model="page" :length="items.length" onclick="document.querySelector('body').scrollTo(0, 500);"></v-pagination>
      </div>
    </v-main>

    <Footer :company="company" class="border-top" />
  </v-app>
</template>

<script>
  import Header from '@/components/default/Header.vue';
  import Footer from '@/components/default/Footer.vue';
  import CallbackForm from '@/components/default/CallbackForm.vue';
  import FirstSliderImage from '@/assets/slider_images/first_slider_image.jpg';
  import SecondSliderImage from '@/assets/slider_images/second_slider_image.jpg';
  import ThirdSliderImage from '@/assets/slider_images/third_slider_image.jpg';
  import goods from '@/mixins/api.js';
  import notification from '@/mixins/api.js';
  import toastr from 'toastr';
  import 'toastr/toastr.scss';
  import categories_list from '@/mixins/categories.js';

  export default {
    name: 'Home',
    components: {
      Header, Footer, CallbackForm
    },
    mixins: [goods, notification, categories_list],
    data() {
      return {
        url: 'https://soapd-shop-api-587eaeba4c14.herokuapp.com',
        company: 'SOAPD_ESIRE',
        page: 1,
        slider: {
          first: FirstSliderImage,
          second: SecondSliderImage,
          third: ThirdSliderImage
        },
        items: [],
        callback: {
          fullname: '',
          email: '',
          phone: '',
          comment: '',
          fullname_error: false,
          email_error: false,
          phone_error: false,
          modal: false,
          disabled: false,
          loading: false
        },
        loader: false,
        category: {s: 'Список категорій', v: null},
        categories: null
      }
    },
    created() {
      this.categories = this.categories_list();
    },
    mounted() {
      toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
        timeOut: 2500,
        toastClass: 'custom-toast',
      };
      this.goodsFunc();
    },
    updated() {
      this.ifActive();
    },
    methods: {
      async goodsFunc(category=null) {
        console.log(category)
        this.loader = true;
        this.items = [];

        try {
          var request;
          if(category === null) {
            request = await this.goods();
          } else {
            request = await this.goods(category);
          }

          if(request['status'] === 200) {
            this.category = {s: 'Список категорій', v: null};
            this.items = request['message'];
            this.ifActive();
          } else {
            toastr.error(request['message'])
          }
        } catch(error) {
          toastr.error('Упс, щось не так з роботою сервера. Спробуйте пізніше!')
        }

        this.loader = false;
      },

      toBucket(el) {
        this.items.forEach(p => {
          p.forEach(i => {
            if(i.id === el.id) {
              if(i.color === 'pink' && i.active === false) {
                i.color = 'orange';
                i.active = 'true';
                i.buttonText = 'Додано'
              } else {
                i.color = 'pink';
                i.active = 'false';
                i.buttonText = 'Додати в кошик';
              }
            }
          })
        })

        var goodsStorage = localStorage.getItem('goodsStorage');
        if (!goodsStorage) {
          localStorage.setItem('goodsStorage', JSON.stringify([el]));
        } else {
          var data = JSON.parse(goodsStorage);
          var found = data.some((e) => e.id === el.id);
          if (found) {
            data = data.filter((e) => e.id !== el.id);
          } else {
            data.push(el);
          }
          localStorage.setItem('goodsStorage', JSON.stringify(data));
        }

        this.ifActive();
      },

      ifActive(allGoods=null) {
        var goodsStorage = localStorage.getItem('goodsStorage');
        if(goodsStorage) {
          var data = JSON.parse(goodsStorage);
          var all_goods = allGoods === null ? this.items : allGoods;

          all_goods.forEach(elem => {
            elem.forEach((i) => {
              var found = data.some((e) => e.id === i.id);
              if(found) {
                i.color = 'orange';
                i.active = true;
                i.buttonText = 'Додано';
              } else { 
                i.color = 'pink';
                i.active = 'false';
                i.buttonText = 'Додати в кошик';
              }
            })
          })
        }
      },

      up() {
        document.querySelector('body').scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      },

      isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },

      isValidPhoneNumber(phoneNumber) {
        var phoneRegex = /^(?:\+38|38)?0\d{9}$/;
        return phoneRegex.test(phoneNumber);
      },

      async notificationFunc(e) {
        const name = this.callback.fullname;
        const email = this.callback.email;
        const phone = this.callback.phone;
        const text = this.callback.comment;

        const name_true = name.replaceAll(' ', '').length !== 0;
        const email_true = this.isValidEmail(email);
        const phone_true = this.isValidPhoneNumber(phone)

        if(name_true && email_true && phone_true) {
          this.callback.disabled = true;
          this.callback.loading = true;

          try {
            const formData = {
              name: name,
              email: email,
              phone: phone,
              comment: text
            }

            const request = await this.notification('callback', formData);
            if(request['status'] === 200) {
              toastr.success(request['message'])

              this.callback.fullname = '';
              this.callback.email = '';
              this.callback.phone = '';
              this.callback.comment = '';
            } else {
              toastr.error(request['message'])
            }
          } catch(error) {
            toastr.error('Упс, щось не так з роботою сервера. Спробуйте пізніше!')
          }

          this.callback.disabled = false;
          this.callback.loading = false;
        } else {
          !name_true ? toastr.error("Поле ім'я обов'язкове для заповнення у форматі: Тарас Шевченко") : false;
          !email_true ? toastr.error("Поле пошти обов'язкове для заповнення у форматі: ukraine@gmail.com") : false;
          !phone_true ? toastr.error("Поле телефону обов'язкове для заповнення у форматі: 380501234567") : false;
        }
      }
    }
  }
</script>

<style>
  body {
    overflow-x: hidden !important;
    scroll-behavior: smooth;
  }

  .callback {
    background: linear-gradient(#e91e63, #FF2121);
  }

  .phone-button-modal {
    z-index: 2;
  }

  .v-pagination__list {
    padding: 0;
  }

  .dropdown {
    z-index: 2;
  }

  .item-description {
    cursor: pointer;
  }

  .v-input__details {
    display: none;
  }
</style>