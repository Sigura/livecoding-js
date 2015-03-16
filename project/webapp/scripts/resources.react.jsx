+(function(module, require, ReactIntl){
'use strict';

var defaultLang = 'en';
var lang = defaultLang;//navigator.language || navigator.browserLanguage;

var locales = [{
    lang: 'en',
    locales: 'en-US',
    formats: {
        number: {
            USD: {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            },
        }
    },
    messages: {
        Date: 'Date',
        LoginFormTitle: 'Please sign in or register',
        Expenses: 'Expenses',
        Total: '{length, plural, one{# expense} other{# expenses}}, Sum:{sum, number, USD}, AVG: {avg, number, USD}, AVG by day:{dayAvg, number, USD}({days}), by week:{weekAvg, number, USD}({weeks}), by month:{monthAvg, number, USD}({months}), by year:{yearAvg, number, USD}({years})',
        expenseDeleted: 'Expense deleted',
        expensesLoaded: 'Expenses data loaded',
        expenseInserted: 'Expense inserted'
    }
},{
    lang: 'ru',
    locales: 'ru-RU',
    formats: {
        number: {
            USD: {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            },
        }
    },
    messages: {
        Date: 'Дата',
        LoginFormTitle: 'Войдите или зарегистрируйтесь',
        Expenses: 'Расходы',
        Total: '{length, plural, one{# запись} other{# записи}}, Сумма:{sum, number, USD}, Среднее за день:{dayAvg, number, USD}, в неделю:{weekAvg, number, USD}, в месяц:{monthAvg, number, USD}, в год:{yearAvg, number, USD}'
    }
}];

var isSupported = locales.filter(function(item){return item.lang === lang;}).length;

lang = isSupported ? lang : defaultLang;
var messages = locales.filter(function(item){return item.lang === lang;}).shift();
    
module.exports = {
    currentLocale: messages.locales,
    supported: locales.map(function(item){return item.locales}),
    messages: messages
};
/*
var supported = [];
for(var locale in messgaes) {
  if(message.hasOwnProperty(locale)){
    supported
  }
}
*/

})(module, require, ReactIntl);