export default {
  data() {
    return {
      all_categories: {
        main_categories: [
          { s: "Букети, інтер'єрні композиції з мила", v: 1, subtitle: 'subcategories_first'},
          { s: 'Зима', v: 2, subtitle: 'subcategories_second'},
          { s: 'Весна', v: 3, subtitle: 'subcategories_third'},
          { s: 'Літо', v: 4, subtitle: 'subcategories_fourth'},
          { s: 'Осінь', v: 5, subtitle: 'subcategories_fifth'},
          { s: 'Чоловікам', v: 6, subtitle: 'subcategories_sixth'},
          { s: 'Тваринки', v: 7, subtitle: 'subcategories_seventh'},
          { s: 'Їстівне', v: 8},
          { s: 'Не їстівне', v: 9},
          { s: 'Крафтове натуральне мило', v: 10},
          { s: 'Свічки ручної роботи', v: 12},
          { s: 'Гіпсові розмальовки ЗД', v: 13},
          { s: 'Супутні товари', v: 14, subtitle: 'subcategories_eighth'}
        ],
        subcategories_first: [
          {s: 'Троянди, орхідеї', v: 0},
          {s: 'Півонії, тюльпани, бузок, весняні квіти', v: 1},
          {s: 'Польові квіти', v: 2},
          {s: 'Змішані букети', v: 3}
        ],
        subcategories_second: [
          {s: 'Різдво', v: 0},
          {s: 'Новий рік', v: 1},
          {s: 'День закоханих', v: 2},
        ],
        subcategories_third: [
          {s: 'Великдень', v: 0}
        ],
        subcategories_fourth: [
          {s: 'Море', v: 0},
          {s: 'Відпочинок', v: 1},
        ],
        subcategories_fifth: [
          {s: 'Школа', v: 0},
          {s: 'Хелловін', v: 1},
        ],
        subcategories_sixth: [
          {s: 'Хобі', v: 0},
          {s: 'Звички', v: 1},
          {s: 'Жарти', v: 2},
        ],
        subcategories_seventh: [
          {s: 'Фігурки', v: 0},
          {s: 'Сувеніри', v: 1},
        ],
        subcategories_eighth: [
          {s: 'Кашпо', v: 0},
          {s: 'Запакування', v: 1},
          {s: 'Додатковий декор', v: 2},
        ],
      }
    }
  },
  methods: {
    categories_list() {
      return this.all_categories;
    }
  }
}
