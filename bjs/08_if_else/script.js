
// Вместо использования prompt() для получения чисел от пользователя, я решил
// попробовать использовать динамическое изменение контента с помощью fetch API
// Для этого весь контент, который будет меняться,
// я пометил в контейнер с id='dynamic_content'
const dynamicContent = document.querySelector('#dynamic_content');

// Глобальные переменные
let attemptCount = 1, // здесь запишем номер попытки
    firstNumber = null, // первое число, которое ввел пользователь
    secondNumber = null, // второе число
    answer = null; // ответ

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
// eventListener будет отслеживать событие 'submit', а затем запускать функции
// в зависимости от id элемента, на котором сработало событие
dynamicContent.addEventListener('submit', function (event) {
    let target = event.target;
    event.preventDefault();
    // находим прогрессбар на странице, чтобы менять его стиль
    let progressBar = document.querySelector('#progress_bar--foreground')

    if (target.id == 'second') {
        progressBar.style.width = '20%';
        getData('./assets/pages/get_first_number.html');
    } else if (target.id == 'third') {
        progressBar.style.width = '40%';
        // записываем в переменную значение, введенное пользователем
        let userInput = parseInt(document.querySelector('.number_input').value);
        if (isNaN(userInput) || userInput === null) {
            // если пользователь не ввел никакого значения, присваиваем переменной firstNumber значение 10
            firstNumber = 10;
        } else if (userInput < -999) {
            // если значение меньше -999, присваиваем -999
            firstNumber = -999;
        } else if (userInput > 999) {
            // если больше 999, присваиваем 999
            firstNumber = 999;
        } else {
            // во всех остальных случаях присваиваем то значение, которое ввел пользователь
            firstNumber = userInput;
        }
        // загружаем контент следующей страницы
        getData('./assets/pages/get_second_number.html');
    } else if (target.id == 'fourth') {
        progressBar.style.width = '60%';
        // по аналогии с первым инпутом, обрабатываем второй
        let userInput = parseInt(document.querySelector('.number_input').value);
        if (isNaN(userInput) || userInput === null) {
            secondNumber = 100;
        } else if (userInput < -999) {
            secondNumber = -999;
        } else if (userInput > 999) {
            secondNumber = 999;
        } else {
            secondNumber = userInput;
        }
        getData('./assets/pages/guess_the_number.html');
    } else if (target.id == 'fifth') {
        progressBar.style.width = '80%';
        getData('./assets/pages/result.html', function () {
            tryGuessNumber();
        });
    } else if (target.id == 'correct') {
        progressBar.style.width = '100%';
        getData('./assets/pages/won.html', function () {
            let randomNumber = random(2);
            document.querySelector('img').src = winFaces[randomNumber];
            document.querySelector('#sub_header').textContent = winPhrases[randomNumber];
        });
    } else if (target.id == 'restart') {
        resetGame();
    } else if (target.id == 'less') {
        tryAgain('less');
    } else if (target.id == 'greater') {
        tryAgain('greater');
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
    answer = null;
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
    let units = number - hundreds - tens;
    // если в числе есть единицы, добавляем их запись к сотням и десяткам
    if (units !== 0) {
        word = word + ' ' + wordNumbers[units]
    }

    // возвращаем результат в текстовом виде
    return word;
}

// вычисляем текстовую запись двухзначного числа
function transformTwoDigit (number) {
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
    return wordNumbers[number];
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
    // сохраняем ответ в числовом виде. Он понадобится, если пользователь будет запускать новые попытки
    answer = number;
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

// за вывод случайной фразы на странице результата отвечает mathRandom.
// Недостатком этой функции является то, что она может несколько раз подряд
// сгенерировать одно и то же число.
// В этом случае н странице может несколько раз подряд выводиться одна
// и та же картинка и одна и та же фраза.
// Я хочу этого избежать, поэтому сделаю механизм, чтобы числ не повторялись.

// в эту переменную будем записывать предыдущее сгенерированное случайное число
let previousRandom;

// функция для генерации случайного числа
function random (count) {
    const number = Math.round(Math.random() * count);
    return number;
}

// пути к картинкам и фразам запишем в массивы
const randomFaces = [
    './assets/images/bubble_upset_1.svg',
    './assets/images/bubble_upset_2.svg',
    './assets/images/bubble_upset_3.svg',
    './assets/images/bubble_upset_4.svg',
    './assets/images/bubble_upset_5.svg',
    './assets/images/bubble_upset_6.svg'
];
const randomPhrases = [
    'может быть это',
    'тогда, наверное, это',
    'ну, тогда это',
    'это определенно',
    'может это',
    'наверняка вы загадали'
];

function tryAgain (state) {
    // увеличиваем номер попытки
    attemptCount++;
    // генерируем случайное число от 0 до 6
    let randomNumber = random(5);
    // если число совпадает с тем, что было сгенерировано ранее, генерируем заново
    while(randomNumber == previousRandom) {
        randomNumber = random(5);
    }
    // сохраняем сгенерированное число для будущих попыток
    previousRandom = randomNumber
    document.querySelector('img').src = randomFaces[randomNumber];
    document.querySelector('#sub_header').textContent = randomPhrases[randomNumber];
    if (state == 'less') {
        secondNumber = answer;
    } else {
        firstNumber = answer;
    }
    tryGuessNumber();
}

const winPhrases = [
    'Я всегда одгадываю!',
    'Это было слишком легко',
    'Проще простого'
];

const winFaces = [
    './assets/images/bubble_win_1.svg',
    './assets/images/bubble_win_2.svg',
    './assets/images/bubble_win_3.svg'
];

getData('./assets/pages/first_page.html'); // при первой загрузке страницы загружаем контент с помощью fetch