/** @Заполнение массива картинками.
 *  @param [number] n. Число картинок в "паре"
 *  @return [Array]
 */
function fillingArray(n) {
   var arr = []
   for (i = 1; i <= n; i++) arr[arr.length] = new Image(String(i));
   return arr;
}


/** @Проверка введенных данных: параметры игры.
 *  @param [number] x, n. х-общее число картинок/ячеек. n - число картинок в "паре"
 *  @return [boolean]
 */
function checkValidXN(x, n) {
   if ((x > 80) || (n < 2)) {
      return false;
   }
   var check = ((x % n) === 0) ? true : false;
   return check;
}


/** @Поздравление с победой.
 *  @function setTimeout: дождаться конца анимации.
 *  @return [Alert]
 */
function win() {
   setTimeout(function() {
      alert('Congratulations!')
   }, 1700);
}


/** @Псевдослучайное число.
 *  @param [number] a, b;
 *  @return [number]
 */
function compareRandom(a, b) {
   return Math.random() - 0.5;
}


/** @Смена стилей для ячеек.
 *  @function setTimeout: анимация.
 *  @param [String] className: имя класса для нового стиля.
 */
var check = function(className) {
   var _tmp = $('.flipped');
   setTimeout(function() {
      for (var i = (_tmp.length - 1); i >= 0; i--) {
         $(_tmp[i]).removeClass().addClass(className);
      }
   }, 1000)
}


/** @Обработчик клика на ячейку.
 *  @param [div] fieldsOfCards: контейнер с ячейками.
 *         [Array] result: Проверка равенства имен картинок.
 *     	           tmp: Буфер;
 *	           tmp_clk: Выбранные ячейки
 *	   [number] x, n: сх-общее число картинок/ячеек. n - число картинок в "паре";
 *		    countClick: счетчик подсчета кликов/сколько выбрано ячеек;
 *	  	    rel:отношение x/n
 *  @className [String] flipped: ячейка перевернута
 *		  	rightChoice: выбрана пара/совпадение n картинок.
 *  @function check: смена имени класса ячейки.
 */
function bindClick(fieldsOfCards, result, countRightChoices, x, n, countClick,
   rel, tmp, tmp_clk) {
   fieldsOfCards.click(function() {
     var id = $(event.target).attr('id'),
         elem = $('#' + id + '');
      if ((tmp.indexOf(id) === -1) && (tmp_clk.indexOf(id) === -1)) { //проверка, нажимал ли пользователь картинку и добавлена ли она в выбранные
         tmp.push(id);
         if ((elem.hasClass('flipped') && elem.hasClass('rightChoice')) !==
            true) { //если ячейка неперевернута и не выбрана "правильно"
            elem.removeClass().addClass('flipped');
            result.push(elem.attr('data-item')) //сохраняем имя картинки
         }
         if (result.length > 1) {
            countClick++;
            if (result[result.length - 2] === result[result.length - 1]) { //если имена/название файлов картинок совпадают
               if (countClick === n) { //если число кликов соответствует числу ячеек для итерации
                   countRightChoices++;
                   check('rightChoice');
                   result = []
                   countClick = 1;
                   tmp_clk.push.apply(tmp_clk, tmp); //помечяем ячейки как выбранные
                   tmp = []; //очистка буфера
               }
            } else { //переворачиваем обратно, если "имена" не равны
               countClick = 1;
               check('notFlipped');
               result = [];
               tmp = [];
            }
            if (countRightChoices === rel) { //если выбраны все пары
               win();
               countRightChoices = 0;
            }
         }
      }
   });
}


/** @Создание поля для ячеек.
 *  @param [div] fieldsOfCards: контейнер для ячеек/div - ов.
 *	   [number] x, n: сх-общее число картинок/ячеек. n - число картинок в "паре";
 *	   [Array] imagesForGame: массив картинок для игры, obj Image содержит имя файла
 */
function drawField(fieldsOfCards, x, n, imagesForGame) {
   for (var i = 0; i < x; i++) {
      fieldsOfCards.append('<div class="block" id ="card-' + i +
         '" data-view="cellForImage" data-item="' + imagesForGame[i].getName() +
         '"></div>');
   }
}


/** @Создание поля для ячеек.
 *  @param [div] fieldsOfCards: контейнер для ячеек/div - ов.
 *         [number] x, n: сх-общее число картинок/ячеек. n - число картинок в "паре";
 *	   [Array] imagesForGame: массив картинок для игры, obj Image содержит имя файла
 */
function startGame() {
  var x = +($('#inputX').val()),
      n = +($('#inputN').val()),
      rel = 0,
      countRightChoices = 0,
      countClick = 1,
      tmp_clk = [],
      tmp = [];
   //проверка корректных данных			
   if (checkValidXN(x, n)) {
     var fieldsOfCards = $('.fieldContainer'),
         imagesForGame = fillingArray(x / n),
         result = [],
         timeOfTheCoup;
      fieldsOfCards.html(''),
         rel = x / n;
      //созадем массив из картинок с соответсвующим числом картинок в "паре"
      var clone = imagesForGame.slice(0);
      for (var j = 1; j < n; j++) {
         imagesForGame = imagesForGame.concat(clone);
      }
      //перемешиваем картинки
      imagesForGame = imagesForGame.sort(compareRandom)
      $(fieldContainer).css('max-width', '' + rel * 75 + 'px');
      //создаем ячейки и обработчик клика
      drawField(fieldsOfCards, x, n, imagesForGame);
      bindClick(fieldsOfCards, result, countRightChoices, x, n, countClick, rel,
         tmp, tmp_clk);
   } else {
      alert("Input correct X and N: X mod N == 0 && X < 80");
   }
}