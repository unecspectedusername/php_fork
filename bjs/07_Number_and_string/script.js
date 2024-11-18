// В этом задании я постарался полностью воспроизвести поведение реального калькулятора.
// Для этого нужно было продумать поведение при различных сценариях взаимодействия пользователя с интерфейсом,
// например, что будет при многократном нажатии на кнопку "равно", 
// при последовательном нажатии на кнопки арифметических операций и т.д.
// из-за особенности записи двоичных чисел в памяти компьютера
// и для корректной работы математических операций с вещественными числами,
// я использовал модуль decimal.js
// https://github.com/MikeMcl/decimal.js

// импортируем decimal.js
import Decimal from "./modules/decimal.mjs";

//находим дисплей калькулятора
const calcDisplay = document.querySelector('#calcDisplay');

// при загрузке страницы выводим на дисплее 0
calcDisplay.textContent = '0';
// отмечаем, что мы ждем ввода от пользователя
let awaitInput = true;
// ждем ли выполнения следующей операции
let awaitOperation = false;
// операция в очереди на выполнение
let queueOperation = null;
// нажимал ли пользователь на кнопку "равно"
let resultReceived = false;
// операнды
let operand1 = null;
let operand2 = null;
// спрятанный операнд (нужен для логики работы кнопки "равно")
let stashedOperand = null;
// нажата ли кнопка "процент"
let percentPressed = false;

// функция по добавлению числа на дисплей
// если ожидается ввод от пользователя,
// очищаем дисплей и выводим на него введенную цифру
// если не ожидается
// добавляем цифру к той, что уже есть на дисплее
function concatDigit(digit) {
    if (awaitInput) {
        calcDisplay.textContent = digit;
        awaitInput = false;
    } else {
        if (calcDisplay.textContent !== '0') {
            calcDisplay.textContent = calcDisplay.textContent + digit;
        } else {
            calcDisplay.textContent = digit;
        }
        
    }
}

// Находим все цифры на клавиатуре и записываем в массив
let digits = document.querySelectorAll('.digit');

// вешаем на каждую цифру на клавиатуре eventListener
// в котором будет выполняться функция по добавлению числа на дисплей
// и в качестве аргумента будет передаваться цифра,
// написанная на кнопке
digits.forEach(element => {
    element.addEventListener('click', function () {
        concatDigit(element.textContent);
    });
});

// функция, которая срабатывает при нажатии на кнопку математической операции (плюс, минус, умножить, делить)
function makeOperation() {
    // если мы не ждем выполнения операции ИЛИ пользователь уже нажимал на кнопку "равно"
    if (awaitOperation == false || resultReceived == true) {
        // первый операнд - число, выведенное на дисплее
        operand1 = calcDisplay.textContent;
        // ждем следующего ввода
        awaitInput = true;
        // ждем выполнения операции
        awaitOperation = true;
        // снимаем отметку о том, что пользователь нажимал на "равно"
        resultReceived = false;
        // очищаем спрятанный операнд (если пользователь ранее нажимал "равно")
        stashedOperand = null;
    } else { // если уже ждем выполнения операции
        // операнд 2 - число на дисплее
        operand2 = calcDisplay.textContent;
        // выполняем операцию, которая стоит в очереди и записываем результат в операнд 1
        operand1 = calc(queueOperation, operand1, operand2);
        // выводим на дисплей операнд 1
        calcDisplay.textContent = operand1;
        // ждем следующего ввода
        awaitInput = true;
    }
    percentPressed = false; // очищаем информацию о нажатии кнопки "процент"
}

// функция по нажатию на кнопку "равно"
function getResult() {
    // здесь нужно было продумать поведение калькулятора при многократном нажатии на кнопку "равно"
    // при повторном нажатии должна повторно производиться последняя математическая операция,
    // но второй операнд должен сохраняться неизменным.
    // операнд 1 будет меняться после каждой проведенной операции
    // чтобы это реализовать я добавил переменную со "спрятанным операндом".
    // Теперь функция работает так:
    // кейс1: пользователь ничего не ввел, ничего не нажимал, сразу нажал "Равно" -> ничего не происходит
    // кейс2: пользователь ввел число и сразу нажал "равно" -> ничего не происходит
    // кейс3: пользователь ввел число, нажал кнопку математической операции и сразу нажал равно -> производится указанная математическая операция, в качестве второго операнда используется то же число, что и первый операнд
    // кейс4: пользователь ввел первое число, нажал математическую операцию, затем ввел второе число и нажал "равно" -> выполняем операцию и "прячем" второй операнд на случай, если пользователь нажмет "равно" еще раз. В этом случае будет выполнена последняя операция, но вторым операндом будет "спрятанное" число, а не то, что на экране
    // если пользователь уже нажимал на кнопки математических операций
    if (awaitOperation) {
        if (stashedOperand == null) {
            operand2 = calcDisplay.textContent;
            stashedOperand = operand2;
            operand1 = calc(queueOperation, operand1, operand2);
            calcDisplay.textContent = operand1;
            awaitInput = true;
            resultReceived = true;
        } else {
            operand1 = calc(queueOperation, operand1, stashedOperand);
            calcDisplay.textContent = operand1;
            awaitInput = true;
            resultReceived = true;
        }
        // операнд 2 - число на дисплее

    }
}

// функция, которая выполняет математические операции
// в качестве аргументов принимает название операции,
// а так же операнды
// для корректной работы функции с вещественными числами, я использовал
// модуль decimal.js
function calc(operation, a, b) {
    const x = new Decimal(a);
    const y = new Decimal(b);
    if (operation == 'addition') {
        return x.plus(y);
    } else if (operation == 'subtraction') {
        return x.minus(y);
    } else if (operation == 'division') {
        return x.dividedBy(y);
    } else if (operation == 'multiplication') {
        return x.times(y);
    }
}

// так выглядел код без использования модуля decimal.js
// function calc(operation, a, b) {
//     if (operation == 'addition') {
//         return parseFloat(a) + parseFloat(b);
//     } else if (operation == 'subtraction') {
//         return parseFloat(a) - parseFloat(b);
//     } else if (operation == 'division') {
//         return parseFloat(a) / parseFloat(b);
//     } else if (operation == 'multiplication') {
//         return parseFloat(a) * parseFloat(b);
//     }
// }

document.querySelector('#plus').addEventListener('click', function () {
    makeOperation();
    queueOperation = 'addition';
});

document.querySelector('#minus').addEventListener('click', function () {
    makeOperation();
    queueOperation = 'subtraction';
});

document.querySelector('#multiply').addEventListener('click', function () {
    makeOperation();
    queueOperation = 'multiplication';
});

document.querySelector('#divide').addEventListener('click', function () {
    makeOperation();
    queueOperation = 'division';
});

document.querySelector('#equal').addEventListener('click', function () {
    getResult();
});

// функция сброса
function reset() {
    calcDisplay.textContent = '0';
    awaitInput = true;
    awaitOperation = false;
    queueOperation = null;
    resultReceived = false;
    operand1 = null;
    operand2 = null;
    stashedOperand = null;
    percentPressed = false;
}

document.querySelector('#ac').addEventListener('click', function () {
    reset();
});

// функция расчета процентов
// на калькуляторе работает по такой логике:
// кейс1: пользователь ввел число и сразу нажал процент -> выводим 1% от числа на экране
// кейс2: пользователь нажал процент еще раз -> так же выводим один процент от числа на экране. Т.е. если пользователь вводит 10 и нажимает "%" три раза, должно поочередно выводиться 0.1, 0,001, 0,00001 и т.д.
// кейс3: пользователь ввел число, нажал на математическую операцию, ввел второе число и нажал процент -> выполняем математическую операцию, где операндом 1 будет первое число, введенное пользователем, а операндом 2 будет количество процентов от первого операнда, на основе второго числа от пользователя
// кейсN: пользователь ввел число, нажал математическую операцию, ввел второе число и нажал процент 1 + N раз -> пользователя нужно лечить от эпилепсии и запретить использовать калькулятор
function getPercent() {
    if (awaitOperation == false) {
        operand1 = calcDisplay.textContent;
        operand1 = (parseFloat(operand1) * 0.01);
        calcDisplay.textContent = operand1;
        console.log(false);
    } else {
        let percentValue = calcDisplay.textContent;
        console.log(operand1);
        console.log(parseFloat(percentValue));
        calcDisplay.textContent = (operand1 / 100) * parseFloat(percentValue);
    }
    // отмечаем, что кнопка процент была нажата
    percentPressed = true;
}

document.querySelector('#percent').addEventListener('click', function () {
    getPercent();
});

// функция по изменению числа на отрицательное / положительное
document.querySelector('#plus_minus').addEventListener('click', function () {
    let number = parseFloat(calcDisplay.textContent);
    number = number * -1;
    calcDisplay.textContent = number;
});

// функция по добавлению точки
document.querySelector('#comma').addEventListener('click', function () {
    // если точки еще нет, то добавляем ее
    if (!calcDisplay.textContent.includes('.')) {
        calcDisplay.textContent = calcDisplay.textContent + '.';
    }
});

// встал вопрос с изменением размера текста в зависимости от величины числа на дисплее
// можно было вычислять длину результата на дисплее и подгонять размер шрифта
// исходя из этого, но в этом случае код получался сильно перегруженным.
// вместо этого я решил попробовать использовать mutationObserver,
// чтобы следить за длиной текста на дисплее калькулятора.
// Не знаю, правильно ли это с технической точки зрения,
// но так код получился короче и читать его легче.
// Опыта использования mutationObserver у меня до этого не было,
// поэтому возможно что-то настроил не совсем правильно.

function mutate(mutations) {
    mutations.forEach(function () {
        if (calcDisplay.textContent.length > 14 && calcDisplay.textContent.length < 21) {
            calcDisplay.style.fontSize = '20px';
        } else if (calcDisplay.textContent.length > 21) {
            calcDisplay.style.fontSize = '15px';
        } else {
            calcDisplay.style.fontSize = '30px';
        }
        console.log(calcDisplay.textContent.length);
    });
}

var target = calcDisplay;
var observer = new MutationObserver(mutate);
var config = {characterData: false, attributes: false, childList: true, subtree: false};

observer.observe(target, config);








