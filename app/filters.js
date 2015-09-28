angular.module('myApp.filters', [])

  .filter('dayFilter', ['$filter', function($filter){
    return function(input, uppercase) {
      input = input || '';

      var day = new Date(input).getDay();

      var days = [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота'
      ];

      return days[day];
    }
  }])

  .filter('dateFilter', ['$filter', function($filter){
    return function(input, uppercase) {
      input = input || '';

      input = new Date(input);

      var date = input.getDate();
      var month = input.getMonth();
      var year = input.getFullYear();

      var months = [
        'Января',
        'Февраля',
        'Марта',
        'Апреля',
        'Мая',
        'Июня',
        'Июля',
        'Августа',
        'Сентября',
        'Октября',
        'Ноября',
        'Декабря'
      ];

      return date + ' ' + months[month] + ' ' + year;
    }
  }])