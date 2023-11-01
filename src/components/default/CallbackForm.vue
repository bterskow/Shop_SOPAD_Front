<template>
  <v-form fast-fail class="pa-5">
    <v-text-field
      type="text"
      v-model="callback.fullname"
      label="Ім'я"
    ></v-text-field>

    <v-text-field
      type="email"
      v-model="callback.email"
      label="Пошта"
    ></v-text-field>

    <v-text-field
      type="tel"
      v-model="callback.phone"
      label="Номер телефону"
    ></v-text-field>

    <v-textarea
      v-model="callback.comment"
      rows="3"
      label="Повідомлення"
      no-resize
    ></v-textarea>

    <v-btn type="submit" :loading="callback.loading" :disabled="callback.disabled" block class="mt-2 notification-btn" @click.prevent="notificationFunc">Запросити зворотній зв'язок</v-btn>
  </v-form>
</template>

<script>
  import notification from '@/mixins/api.js';
  import toastr from 'toastr';
  import 'toastr/toastr.scss';

  export default {
    name: "CallbackForm",
    props: {
      callback: Object,
      notificationFunc: Function,
      isValidEmail: Function,
      isValidPhoneNumber: Function,
    },
    mounted() {
      toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
        timeOut: 2500,
        toastClass: 'custom-toast',
      };
    }
  }
</script>