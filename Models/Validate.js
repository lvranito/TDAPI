'use strict'

//#region read prefixes file
var fileModule = require('./Prefixes');

function loadPrefixFile() { 
    if(fileModule.prefixes === undefined)
    {
        fileModule.LoadPrefixes();
    }
}
//#endregion

function isEmptyObject(obj) {
    let ret = new Object();
    ret.isValid = true;
    ret.message = '';
    ret.phoneNumbers = [];
    if (!Object.keys(obj).length)
    { 
        ret.isValid = false;
        ret.message = 'empty body';
    }
    return ret;
}

//#region format e pre-validate number
// convert number to format for been seached in prefixes array
function GetPhoneNumber(number){
    var aux = number.trim();

    // checks if number stats with "00" and replaces by "+"
    if(aux.substring(0,2) == '00')
        aux = "+" + aux.substr(2); 

    //checks if start "+ " (plus space) if so then its invalid or if its not a number (removing spaces)
    if(aux.substring(1,1) == ' ' || isNaN(aux.substr(1).replace(/\s/g,'')))
        aux = undefined;
    else
    {
        // removes '+' sign and all spaces
        aux =aux.replace(/\s/g,'');
        if (aux.substring(0,1) == '+') 
            aux = (aux.substr(1)).replace(/\s/g,'');
    }
    return aux;
}


// checks for invalid numbers
// return false if there is a invalid number
function checkNumbers(obj,ret) {
    obj.forEach(element => { 
        var number = GetPhoneNumber(element);
        // don´t include repeated numbers
        if(number != undefined && number != '' && ret.phoneNumbers.find(p => p.number == number) === undefined)
            ret.phoneNumbers.push({number: number});
    });
    return ret;
}
//#endregion

exports.validateData = function(obj){

    // check for no phone numbers
    var ret = isEmptyObject(obj);

    // load list of prefixes numbers
    if (ret.isValid) {
        ret = checkNumbers(obj,ret);
        if (ret.isValid)
        {
            loadPrefixFile();
            fileModule.CheckPrefixes(ret.phoneNumbers);
        }
    }
    return ret;
}


