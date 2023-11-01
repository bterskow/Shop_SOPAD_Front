<template>
  <v-app-bar color="pink" density="compact">
    <template v-slot:prepend>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-app-bar-nav-icon v-bind="props"></v-app-bar-nav-icon>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, i) in menu"
            :key="i"
          >
            <v-list-item-title><a href="#goods" class="text-dark text-center fw-bold">{{ item.title }}</a></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <v-app-bar-title class="fw-bold">{{ company }}</v-app-bar-title>

    <v-layout class="d-none d-md-flex">
      <v-btn @click="social(0)">
        <v-icon class="mx-1">mdi-instagram</v-icon>
        <span class="mx-1">Instagram</span>
      </v-btn>

      <v-btn @click="social(1)">
        <v-icon class="mx-1">mdi-facebook</v-icon>
        <span class="mx-1">Facebook</span>
      </v-btn>

      <v-btn @click="social(2)">
        <v-icon class="mx-1">mdi-navigation</v-icon>
        <span class="mx-1">Telegram</span>
      </v-btn>
    </v-layout>

    <template v-slot:append>
      <v-btn icon="mdi-cart-outline" @click="bucket = true; forBuying();"></v-btn>
      <v-dialog
        v-model="bucket"
        width="370"
        persistent
      >
        <v-card>
          <v-toolbar
            color="pink"
            title="Кошик"
          >
            <v-card-actions class="justify-end">
              <v-btn
                color="black"
                variant="text"
                @click.prevent="bucket = false"
                icon="mdi-close"
              >
              </v-btn>
            </v-card-actions>
          </v-toolbar>

          <hr class="m-0 p-0" />

          <div v-if="goods && goods.length > 0">
            <div class="d-flex align-center justify-center v-table-block">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center fw-bold">
                      Товар
                    </th>
                    <th class="text-center fw-bold">
                      Вартість
                    </th>
                    <th class="text-center fw-bold">
                      Кількість
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="el in goods" :key="el.id">
                    <td class="text-center">
                      <div class="d-flex align-center justify-center">
                        <v-btn class="mx-1" width="30" height="30" color="pink" icon="cirlce" @click="deleteFromBucket(el.id)"><v-icon center icon="mdi-delete-forever"></v-icon>
                          <v-tooltip activator="parent" location="left">Видалити</v-tooltip>
                        </v-btn>
                        <span class="mx-1">{{ el.title.length > 5 ? el.title.substr(0, 5) :  el.title}}<v-tooltip activator="parent" location="right">{{el.title}}</v-tooltip></span>
                      </div>
                    </td>
                    <td class="text-center">₴ {{ el.sum }}</td>
                    <td class="text-center">
                      <input type="number" min="1" max="10" v-model="el.count" @change="newAmount(el.title, el.sum, el.count, el.oldSum)" class="border border-1 border-navy rounded-2 p-1" />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>

            <hr class="m-0 p-0" />

            <div class="mx-2 my-3">
              <div class="text-center">
                <p class="p-0 m-0"><span class="fw-bold">Загальна вартість покупки:</span> {{ totalAmount }}</p>
                <v-btn color="pink" class="mt-2" @click="nextStep">Продовжити оформлення</v-btn>
              </div>
            </div>
          </div>

          <div v-if="!goods || goods.length === 0" class="m-5">
            <div class="d-flex align-center justify-center">
              <p class="fw-bold p-0 m-0 text-center">Кошик пустий! Продовжуйте шопінг!</p>
            </div>
          </div>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="next"
        width="370"
      >
        <v-card>
          <v-toolbar
            color="pink"
            title="Оформлення"
          >
            <v-card-actions class="justify-end">
              <v-btn
                color="black"
                variant="text"
                @click.prevent="next = false"
                icon="mdi-close"
              >
              </v-btn>
            </v-card-actions>
          </v-toolbar>

          <hr class="m-0 p-0" />

          <div>
            <v-form fast-fail class="pa-5">
              <v-text-field
                type="tel"
                v-model="phone"
                label="Номер телефону"
              ></v-text-field>

              <v-btn type="submit" color="pink" :loading="loading" :disabled="disabled" block class="mt-4" @click.prevent="notificationFunc">Відправити</v-btn>
            </v-form>
          </div>
        </v-card>
      </v-dialog>
    </template>
  </v-app-bar>
</template>

<script>
  import notification from '@/mixins/api.js';
  import toastr from 'toastr';
  import 'toastr/toastr.scss';

  export default {
    name: 'Header',
    mixins: [notification],
    props: {
      company: String,
      allGoods: Array,
      ifActive: Function,
    },
    data() {
      return {
        goods: null,
        totalAmount: null,
        bucket: false,
        next: false,
        phone: '',
        loading: false,
        disabled: false,
        menu: [
          {title: 'До букетів'},
        ]
      }
    },
    methods: {
      newAmount(title, sum, count, oldSum) {
        if (oldSum) {
          this.totalAmount = this.totalAmount - oldSum + (sum * count);
        } else {
          this.totalAmount = this.totalAmount - sum + (sum * count);
        }
        
        this.goods.forEach(e => {
          if(e.title === title) {
            e['oldSum'] = sum * count;
          }  
        })
      },

      social(n) {
        var socials = ['https://instagram.com/soapd_esire', 'https://facebook.com', 'https://telegram.org'];
        window.open(socials[n]);
      },

      forBuying() {
        var goodsStorage = localStorage.getItem('goodsStorage');
        if (goodsStorage) {
          this.goods = JSON.parse(goodsStorage);

          if (this.goods.length > 1) {
            var reduced = (a, b) => a + b.sum;
            this.totalAmount = this.goods.reduce(reduced, 0);
          } else {
            this.totalAmount = this.goods.length !== 0 ? this.goods[0].sum : 0;
          }

          this.goods.forEach(e => e['count'] = 1);
        }
      },

      deleteFromBucket(id) {
        var goodsStorage = localStorage.getItem('goodsStorage');
        var data = JSON.parse(goodsStorage);
        var found = data.some((e) => e.id === id);
        if (found) {
          data = data.filter((e) => e.id !== id);
        }

        localStorage.setItem('goodsStorage', JSON.stringify(data));

        this.forBuying();
        this.ifActive(this.allGoods);
      },

      nextStep() {
        this.bucket = false;
        this.next = true;
      },

      isValidPhoneNumber(phoneNumber) {
        var phoneRegex = /^(?:\+38|38)?0\d{9}$/;
        return phoneRegex.test(phoneNumber);
      },

      clearAll() {
        localStorage.setItem('goodsStorage', JSON.stringify([]));
        this.next = false;
        this.phone = '';
        this.forBuying();
        this.ifActive(this.allGoods);
      },

      async notificationFunc() {
        const goods = this.goods;
        const phone = this.phone;

        const phone_true = this.isValidPhoneNumber(phone)

        if(phone_true) {
          this.disabled = true;
          this.loading = true;

          try {
            const formData = {
               phone: phone,
               order: goods
            }

            const request = await this.notification('order', formData);
            if(request['status'] === 200) {
              toastr.success(request['message']);
              this.clearAll();
            } else {
              toastr.error(request['message'])
            }
          } catch(error) {
            toastr.error('Упс, щось не так з роботою сервера. Спробуйте пізніше!')
          }

          this.disabled = false;
          this.loading = false;
        } else {
          !phone_true ? toastr.error("Поле телефону обов'язкове для заповнення у форматі: 380501234567") : false;
        }
      }
    }
  }
</script>

<style>
    .v-table__wrapper {
      overflow-x: hidden !important;
    }
</style>