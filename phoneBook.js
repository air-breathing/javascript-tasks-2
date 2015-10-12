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
    if (!(validatePhone(phone) && validateEmail(email))) {
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
    var matchEmail = email.match(reEmail);
    if (matchEmail) {
        return email;
    } else {
        return null;
    }
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
    var matchPhone = phone.match(rePhone);
    //console.log(match);
    if (matchPhone) {
        //return match.slice(1, 2).concat(match.slice(3, 8)).join('');
        return phone;
    } else {
        return null;
    }
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
    searchInAnyField(printEntry, query);
};


/**
 * Осуществляет поиск указанной в query строке.
 * Если подходящая запись нашлась, то выполняется функция actionWithEntry.
 * actionWithEntry принимает два аргумента - регулярку для поиска и элемент,
 * в котором необходимо найти.
 *
 * @param {function}actionWithEntry
 * @param {string}query
 * @returns {number}
 */
function searchInAnyField(actionWithEntry, query) {
    var i;
    var countFieldWithQuery = 0;
    var regOfQuery = new RegExp(query);
    for (i = 0; i < phoneBook.length; i++) {
        if (searchQueryInString(regOfQuery, phoneBook[i].name) ||
            searchQueryInString(regOfQuery, phoneBook[i].phone) ||
            searchQueryInString(regOfQuery, phoneBook[i].email)) {
            actionWithEntry(i, phoneBook);
            countFieldWithQuery ++;
        }
    }
    return countFieldWithQuery;
}

/**
 *Ищет в str выражение queryReg;
 *
 * @param {re}queryReg
 * @param {string}str
 * @returns {Array|*}
 */
function searchQueryInString(queryReg, str) {
    return str.match(queryReg);
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
    console.log(searchInAnyField(deleteEntry, query));
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
    //var amount_of_symbol_in_str = 2 + maxLenghtName + 3 + maxLengthEmail + 3 + maxLengthPhone + 2;
    console.log('╔' + repeatStr('=', (maxLenghtName + 2)) + '╤' +
        repeatStr('=', (maxLengthPhone + 2)) +
        '╤' + repeatStr('=', (maxLengthEmail + 2)) + '╗');
    console.log('║' + ' ' + columnName + repeatStr(' ', maxLenghtName - columnName.length + 1) +
        '│' + ' ' + columnPhone + repeatStr(' ', maxLengthPhone - columnPhone.length + 1) +
        '│' + ' ' + columnEmail + repeatStr(' ', maxLengthEmail - columnEmail.length + 1) + '║');
    console.log('╠' + repeatStr('=', (maxLenghtName + 2)) + '╧' +
        repeatStr('=', (maxLengthPhone + 2)) +
        '╧' + repeatStr('=', (maxLengthEmail + 2)) + '╣');
    var i;
    for (i = 0;i < phoneBook.length - 1; i++) {
        console.log('║' + ' ' + phoneBook[i].name +
            repeatStr(' ', maxLenghtName - phoneBook[i].name.length + 1) +
            '│' + ' ' + phoneBook[i].phone +
            repeatStr(' ', maxLengthPhone - phoneBook[i].phone.length + 1) +
            '│' + ' ' + phoneBook[i].email +
            repeatStr(' ', maxLengthEmail - phoneBook[i].email.length + 1) + '║');

        console.log('╟' + repeatStr('-', (maxLenghtName + 2)) + '┼' +
                    repeatStr('-', (maxLengthPhone + 2)) +
                    '┼' + repeatStr('-', (maxLengthEmail + 2)) + '╢');
    }
    console.log('║' + ' ' + phoneBook[phoneBook.length - 1].name +
                repeatStr(' ', maxLenghtName - phoneBook[phoneBook.length - 1].name.length + 1) +
                '│' + ' ' + phoneBook[phoneBook.length - 1].phone +
                repeatStr(' ', maxLengthPhone - phoneBook[phoneBook.length - 1].phone.length + 1) +
                '│' + ' ' + phoneBook[phoneBook.length - 1].email +
                repeatStr(' ', maxLengthEmail - phoneBook[phoneBook.length - 1].email.length + 1) +
                '║');
    console.log('╚' + repeatStr('=', (maxLenghtName + 2)) + '╧' +
                repeatStr('=', (maxLengthPhone + 2)) +
                '╧' + repeatStr('=', (maxLengthEmail + 2)) + '╝');
};


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
