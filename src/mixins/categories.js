export default {
  data() {
    return {
      all_categories: [
        { s: 'Florida', v: 1 },
        { s: 'Georgia', v: 2 },
        { s: 'Nebraska', v: 3 },
        { s: 'California', v: 4 },
        { s: 'New York', v: 5 },
      ],
    }
  },
  methods: {
    categories_list() {
      return this.all_categories;
    }
  }
}
