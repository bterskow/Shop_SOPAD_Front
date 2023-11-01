<template>
  <div class="container">
    <footer class="d-flex flex-wrap justify-content-center align-items-center py-3 my-4">
      <div class="justify-content-end list-unstyled d-flex">
        <div class="d-block d-md-none">
          <v-btn @click="social(0)" class="mx-4">
            <v-icon class="mx-1">mdi-instagram</v-icon>
          </v-btn>

          <v-btn @click="social(1)" class="mx-4">
            <v-icon class="mx-1">mdi-facebook</v-icon>
          </v-btn>

          <v-btn @click="social(2)" class="mx-4">
            <v-icon class="mx-1">mdi-navigation</v-icon>
          </v-btn>
        </div>
        <div class="d-none d-md-block col-md-12">
          <p class="text-center text-body-secondary m-0 p-0">© {{ new Date().getFullYear() }} {{ company }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'Footer',
    props: {
      company: String,
    },
    methods: {
      social(n) {
        var socials = ['https://instagram.com', 'https://facebook.com', 'https://telegram.org'];
        window.open(socials[n]);
      }
    }
  }
</script>
