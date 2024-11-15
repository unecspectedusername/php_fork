
// Вместо использования prompt() для получения чисел от пользователя, я решил
// попробовать использовать динамическое изменение контента с помощью fetch API
// Для этого весь контент, который будет меняться,
// я пометил в контейнер с id='dynamic_content'
const dynamicContent = document.querySelector('#dynamic_content');

// Глобальные переменные
let attemptCount = 1, // здесь запишем номер попытки
    firstNumber = null, // первое число, которое ввел пользователь
    secondNumber = null; // второе число

// Функция, которая будет менять контент на странице
async function getData(url, callback) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const text = await response.text();
        dynamicContent.innerHTML = text;
        // при получении контента по fetch не срабатывает autofocus в инпутах,
        // поэтому находим инпуты на странице, если они есть, делаем на них фокус
        const focusElement = document.querySelector('input[autofocus]');
        if (focusElement) {
            focusElement.focus();
        }
        callback();
    } catch (error) {
        console.error(error.message);
    }
}

// На странице будут подгружаться разные кнопки и инпуты,
// на которые нужно вешать eventListener.
// Чтобы не вешать на каждый, я решил использовать делегирование событий
// и поставил eventListener на контейнер dynamicContent, а все поля input
// и кнопки поместил в form.
// eventListener будет отслеживать событие 'submit, а затем запускать функции
// в зависимости от id элемента, на котором сработало событие
dynamicContent.addEventListener('submit', function (event) {
    let target = event.target;
    event.preventDefault();

    if (target.id == 'second') {
        getData('./assets/pages/get_first_number.html');
    } else if (target.id == 'third') {
        firstNumber = parseInt(document.querySelector('.number_input').value); // сохраняем первое число, введенное пользователем
        getData('./assets/pages/get_second_number.html');
    } else if (target.id == 'fourth') {
        secondNumber = parseInt(document.querySelector('.number_input').value);
        getData('./assets/pages/guess_the_number.html');
    } else if (target.id == 'fifth') {
        getData('./assets/pages/result.html', function () {
            tryGuessNumber();
        });
    } else if (target.id == 'restart') {
        resetGame();
    }
});

// функция меняет заголовок на последней странице, выводя номер попытки
function displayAttempt() { 
    document.querySelector('h1').textContent = `Попытка ${attemptCount}`;
}

// функция перезапуска игры
function resetGame() {
    getData('./assets/pages/first_page.html');
    attemptCount = 1;
    firstNumber = null;
    secondNumber = null;
}

// функция бинарного поиска
function binarySearch () {
    const result = Math.floor((firstNumber + (secondNumber - firstNumber)/2))
    return result;
}

// обработка числа для вывода в текстовой форме

// создаем объект, в котором хранятся текстовые записи чисел
const wordNumbers = {
    0: 'ноль',
    1: 'один',
    2: 'два',
    3: 'три',
    4: 'четыре',
    5: 'пять',
    6: 'шесть',
    7: 'семь',
    8: 'восемь',
    9: 'девять',
    10: 'десять',
    11: 'одиннадцать',
    12: 'двенадцать',
    13: 'тринадцать',
    14: 'четырнадцать',
    15: 'пятнадцать',
    16: 'шестнадцать',
    17: 'семнадцать',
    18: 'восемнадцать',
    19: 'девятнадцать',
    20: 'двадцать',
    30: 'тридцать',
    40: 'сорок',
    50: 'пятьдесят',
    60: 'шестьдесят',
    70: 'семьдесят',
    80: 'восемьдесят',
    90: 'девяносто',
    100: 'сто',
    200: 'двести',
    300: 'триста',
    400: 'четыреста',
    500: 'пятьсот',
    600: 'шестьсот',
    700: 'семьсот',
    800: 'восемьсот',
    900: 'девятьсот'
}

// вычисляем текстовую запись трехзначного числа
function transformThreeDigit (number) {
    // задаем переменную для хранения текстовой записи
    let word;
    // чтобы определить сотни, вычитаем из числа остаток от его деления на 100
    let hundreds = number - number % 100;
    // записываем текстовую запись сотен в переменную
    word = wordNumbers[hundreds];
    // чтобы определить десятки, вычитаем из числа сотни, и из полученного результата остаток деления на 10
    let tens = (number - hundreds);
    tens = tens - tens % 10
    // если в числе есть десятки, добавляем запись десятков к сотням
    if (tens !== 0) {
        word = word + ' ' + wordNumbers[tens];
    }
    // Чтобы определить единицы, вычитаем из числа сотни и десятки
    let units = number - hundreds - tens
    // если в числе есть единицы, добавляем их запись к сотням и десяткам
    if (units !== 0) {
        word = word + ' ' + wordNumbers[units]
    }

    return word;
}

// вычисляем текстовую запись двухзначного числа
function transformTwoDigit (number) {
    // в начале было слово
    let word;
    let tens = number - number % 10;
    word = wordNumbers[tens];
    let units = number - tens;
    if (units !== 0) {
        word = word + ' ' + wordNumbers[units];
    }

    return word;
}

// // вычисляем текстовую запись числа с одним знаком
function transformOneDigit (number) {
    return wordNumbers[number]
}

// функция по преобразованию числа в текстовую запись
function transformNumber (number) {
    let word, // здесь сохраним число в текстовом виде
    negative = false; // здесь запишем, является ли число отрицательным
    // если число меньше 0, записываем это в переменную negative и преобразуем число в положительное
    if (number < 0) {
        number = number * -1;
        negative = true;
    } else if (number === 0) {
        // если число равно 0, не проводим вычисления, а сразу присваиваем его текстовую запись
        word = wordNumbers[0];
    }

    // в зависимости от количества символов в числе, вычисляем его текстовую запись
    if (number < 20) {
        word = transformOneDigit(number);
    } else if (number < 100) {
        word = transformTwoDigit(number);
    } else if (number < 1000) {
        word = transformThreeDigit(number);
    }

    // если число отрицательное, добавляем к текстовой записи слово "минус"
    if (negative === true) {
        word = 'минус ' + word;
    }
    return word;
}

// функция пытается отгадать число, загаданное пользователем
function tryGuessNumber () {
    // выводим номер попытки на экран
    displayAttempt();
    // с помощью бинарного поиска находим среднее значение 
    let number = binarySearch();
    // переводим значение в текст
    let word = transformNumber(number);
    // если текстовая запись числа больше 20 символов, выводим ответ в виде цифр
    // если меньше - в виде текста
    if (word.length > 20) {
        document.querySelector('#answer').textContent = number;
    } else {
        document.querySelector('#answer').textContent = word;
    }
}

resetGame();