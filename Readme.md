##Приложение для трекинга погоды

### Описание задачи:

Разработать web-приложение, отслеживающее текущую погоду, а также погоду на ближайшие три дня. 
Первоначально должна запрашиваться информация о городе, в котором вы находитесь, ваши текущие координаты можно запросить 
с помощью geolocation API. Интерфейс должен предоствалять возможность добавления и удаления городов для отслеживания 
погоды, список выбранных городов нужно сохранять в localStorage.  
 
Сервис для получения данных о погоде https://www.apixu.com
 
Фунционал должен быть написан без использования фреймворков. Дизайн и оформление остается за вами, макетов и протипов не
предусмотрено. Требования к заданию:
 
адаптивная верстка;
должны быть нотификации для пользователя, если произошла ошибка при запросах к серверу;
десктопные браузеры выше IE11, остальные - 2 последние версии. Мобильные браузеры - Android 4.4, Safari 9, остальные - 3 последних версии. 
 
Архитектура должна быть построена на модулях, связанных событийной моделью.

### Развертывание приложения:

##### parameters.json:
  необходимо создать файл parameters.json в корне проекта и заполнить его корректными api ключами, шаблон для заполнения есть в файле parameters.json.dist

##### дев версия:

```
npm install
npm run start
```

##### прод версия

```
npm install
npm run build
```
билд сложится в папку dist в корне проекта