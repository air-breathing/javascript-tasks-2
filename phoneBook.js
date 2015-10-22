/**
 * Created by Надежда on 10.10.2015.
 */

'use strict';

var phoneBook = [];
var columnName = 'name';
var columnPhone = 'phone';
var columnEmail = 'email';
var maxLenghtName = columnName.length;
var maxLengthEmail = columnEmail.length;
var maxLengthPhone = columnPhone.length;

/**
 * Добавляет новую запись, если она валидна.
 *
 * @param {string}name
 * @param {string}phone
 * @param {string}email
 */
module.exports.add = function add(name, phone, email) {
    if (!validatePhone(phone)) {
        console.log('Number is not correct');
        return;
    }

    if (!validateEmail(email)) {
        console.log('Email is not correct');
        return;
    }
    var entry = {
        name: name,
        phone: phone,
        email: email
    };
    if (name.length > maxLenghtName) {
        maxLenghtName = name.length;
    }
    if (email.length > maxLengthEmail) {
        maxLengthEmail = email.length;
    }
    if (phone.length > maxLengthPhone) {
        maxLengthPhone = phone.length;
    }
    var findedIndex = findIndexInsert(entry);
    if (findedIndex !== -1) {
        phoneBook.splice(findedIndex, 0, entry);
    }
};


/**
 * Проверяет валидность email.
 *
 * @param {String}email
 * @returns {*}
 */
function validateEmail(email) {
    var reEmail = /^[\w]{1}[\w\-\.]*@([\w\-А-Яа-я]+\.)*[a-zа-я]{2,4}$/;
    return reEmail.test(email);
}

/**
 *
 * Проверяет валидность телефонного номера.
 *
 * @param {String}phone
 * @returns {*}
 */
function validatePhone(phone) {
    var rePhone = /^(\+{0,1}\d{0,2})? ?((\d{3})|\((\d{3})\)) ?(\d{3}) ?-?(\d) ?-?(\d{3})$/;
    return rePhone.test(phone);
}

/**
 *
 * Определяет необходимость и место вставки новой записи в телефонную книгу.
 *
 *
 * @param entry
 * @returns {number}
 */
function findIndexInsert(entry) {
    var begin = 0;
    var end = phoneBook.length - 1;
    var newDiap;
    var exist = false;

    while (begin < end) {
        //выбираем индекс
        newDiap = findIndex(entry, begin, end);
        begin = newDiap.begin;
        end = newDiap.end;
        exist = newDiap.existance;
    }
    if (begin === end) {
        newDiap = findIndex(entry, begin, end);
        begin = newDiap.begin;
        end = newDiap.end;
        exist = newDiap.existance;
    }
    if (exist) {
        return -1;
    }
    return begin;
}

/**
 * Осуществляет двоичный поиск записи по телефонной книге.
 *
 * @param element
 * @param {number}begin
 * @param {number}end
 * @returns {*}
 */

function findIndex(element, begin, end) {
    var mid = integerDivision((begin + end), 2);
    var compEntry = compareEntry(element, phoneBook[mid]);
    if (compEntry == 0) {
        return {begin: mid, end: mid, existance: true};
    }
    if (compEntry > 0) {
        return {begin: mid + 1, end: end, existance: false};
    }
    if (compEntry < 0) {
        return {begin: begin, end: mid - 1, existance: false};
    }
}

/**
 * Целочисленное деление.
 *
 * @param {number}x
 * @param {number}y
 * @returns {number}
 */
function integerDivision(x, y) {
    return (x - x % y) / y;
}

/**
 * Сравнивает две записи в алфавитном порядке.
 * @param entry1
 * @param entry2
 * @returns {number}
 */

function compareEntry(entry1, entry2) {
    var compName;
    var compPhone;
    var compEmail;
    compName = entry1.name.localeCompare(entry2.name);
    if (compName == 0) {
        compPhone = entry1.phone.localeCompare(entry2.phone);
        if (compPhone == 0) {
            compEmail = entry1.email.localeCompare(entry2.email);
            return compEmail;
        } else {
            return compPhone;
        }
    } else {
        return compName;
    }
}

/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
module.exports.find = function find(query) {
    searchInAnyField(query, printEntry);
};


/**
 * Осуществляет поиск указанной в query строке.
 * Если подходящая запись нашлась, то выполняется функция actionWithEntry.
 * actionWithEntry принимает два аргумента - регулярку для поиска и элемент,
 * в котором необходимо найти.
 *
 * @param {string}query
 * @param {function}actionWithEntry
 * @returns {number}
 */
function searchInAnyField(query, actionWithEntry) {
    var i;
    var countFieldWithQuery = 0;
    var regOfQuery = new RegExp(query, i);
    for (i = 0; i < phoneBook.length; i++) {
        var testedString = phoneBook[i].name + ' ' +
                            phoneBook[i].phone + ' ' +
                            phoneBook[i].email;
        if (regOfQuery.test(testedString)) {
            actionWithEntry(i, phoneBook);
            countFieldWithQuery ++;
        }
    }
    return countFieldWithQuery;
}

/**
 * Выводит запись из массива с элементами с нужным индексом.
 *
 * @param {number}indexElement
 * @param {Array}arrayElemnts
 */
function printEntry(indexElement, arrayElemnts) {
    console.log(arrayElemnts[indexElement].name, ', ',
                arrayElemnts[indexElement].phone, ', ',
                arrayElemnts[indexElement].email);
}

/*
   Функция удаления записи в телефонной книге.
*/
module.exports.remove = function remove(query) {
    console.log(searchInAnyField(query, deleteEntry));
    clearFromNull(phoneBook);
};

/**
 * Заменяет удаленную запись на null;
 *
 * @param {number}indexElement
 * @param {Array}arrayElemnts
 */
function deleteEntry(indexElement, arrayElemnts) {
    arrayElemnts.splice(indexElement, 1, null);
}

/**
 * Удаляет из массива все значения null;
 *
 * @param array
 */
function clearFromNull(array) {
    var current = 0;
    while (current < array.length) {
        if (array[current] === null) {
            array.splice(current, 1);
        } else {
            current++;
        }
    }
}

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    data = data.split('\n');
    var i;
    for (i = 0; i < data.length; i++) {
        var notValidatedData = data[i].split(';');
        if (notValidatedData.length >= 3) {
            module.exports.add(notValidatedData[0], notValidatedData[1], notValidatedData[2]);
        }
    }
};

/*
   Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
*/
module.exports.showTable = function showTable() {
    printHead();
    printPhoneNotes();
};

function printHead(){
    printHighBoldBorder();
    printHeadValues();
    printAverageBoldBorder();
}

function printPhoneNotes(){
    var i;
    for (i = 0;i < phoneBook.length - 1; i++) {
        printValues(phoneBook[i].name, phoneBook[i].phone, phoneBook[i].email);
        printBorder();

    }
    printValues(phoneBook[phoneBook.length - 1].name,
                phoneBook[phoneBook.length - 1].phone,
                phoneBook[phoneBook.length - 1].email);
    printBottomBoldBorder();
}

function printValues(val1, val2, val3){
    console.log('║ %s%s│ %s%s│ %s%s║',
        val1, ' '.repeat(maxLenghtName - val1.length + 1),
        val2, ' '.repeat(maxLengthPhone - val2.length + 1),
        val3, ' '.repeat(maxLengthEmail - val3.length + 1));
}

function printHighBoldBorder() {
    console.log('╔%s╤%s╤%s╗',
        '='.repeat(maxLenghtName + 2),
        '='.repeat(maxLengthPhone + 2),
        '='.repeat(maxLengthEmail + 2));
}

function printBottomBoldBorder() {
    console.log('╚%s╧%s╧%s╝',
        '='.repeat(maxLenghtName + 2),
        '='.repeat(maxLengthPhone + 2),
        '='.repeat(maxLengthEmail + 2));
}

function printHeadValues() {
    console.log('║ %s%s│ %s%s│ %s%s║',
        columnName, ' '.repeat(maxLenghtName - columnName.length + 1),
        columnPhone, ' '.repeat(maxLengthPhone - columnPhone.length + 1),
        columnEmail, ' '.repeat(maxLengthEmail - columnEmail.length + 1));
}

function printAverageBoldBorder() {
    console.log('╠%s╧%s╧%s╣',
        '='.repeat(maxLenghtName + 2),
        '='.repeat(maxLengthPhone + 2),
        '='.repeat(maxLengthEmail + 2));
}

function printBorder(){
    console.log('╟%s┼%s┼%s╢',
        '-'.repeat(maxLenghtName + 2),
        '-'.repeat(maxLengthPhone + 2),
        '-'.repeat(maxLengthEmail + 2));
}


/**
 * Создает строку с необходимым числом повторений.
 *
 * @param {string}elem
 * @param {number}amountRepeats
 * @returns {string}
 */
function repeatStr(elem, amountRepeats) {
    var result = '';
    var index = 0;
    for (; index < amountRepeats; index++) {
        result += elem;
    }
    return result;
}
