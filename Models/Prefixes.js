'use strict'
/******************************************
 library used to manipulate prefixes file
 Load prefixes.txt to memory
 Searches for a prefix
 Validate phone in prefixes data
*******************************************/
var config = require('../Config.json');
const fileName = config.configuration.prefixFile;

// loads the prefixes files into object array
exports.LoadPrefixes = function() {
    var fs = require('fs');
    var path = require('path');
    var fileLoc = path.resolve('./Resources');
    fileLoc = path.join(fileLoc, fileName);

    try {
        //exports.prefixes = fs.readFileSync(fileLoc,'utf8').split('\n');    
        //exports.prefixes = fs.readFileSync(fileLoc,'utf8').split('\n').map(function(item) {
        //    return parseInt(item,7);
        //});
        exports.prefixes = new Map(fs.readFileSync(fileLoc,'utf8').split('\n').map(i => [i,i]));  
        //var gg = new Map(this.prefixes.map(i => [i,i]));  
    } catch (error) {
        console.log('Error',error.stack);
    }
}

exports.CheckPrefixes = function(vals){
    if (this.prefixes === undefined) return;

    for (let element of vals) {
        //var ret = this.prefifind(el => element.match(new RegExp("\\b" + el)));
            for (let i = 1; i <= element.number.length; i++) {
                var ret = this.prefixes.get(element.number.substring(0,i));
                if (ret != undefined && ret.length > 0) 
                { 
                    element.prefix = ret;      
                    break;  
                }
            }    
    };


}

