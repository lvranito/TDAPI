/***** retData object structure ********
    isValid: bool  -- validation state 
    message: string -- return message error / success
    code: int -- http return code
    data: object -- prefix code data
****************************************/
const config = require('../Config.json');

function returnDataEmpty() {
        this.isValid = true;
        this.message = '';
        this.code = 200;
        this.data = new Object();
    }

function returnData(valid, type) {
    retMsg = config.errors.find(element => element.state == type);   
    this.isValid = valid;
    this.message = retMsg.return.message;
    this.code = retMsg.return.code;
    this.data = new Object();
}

function returnDataMessage(valid, type, message) {
    retMsg = config.errors.find(element => element.state == type);   
    this.isValid = valid;
    this.message = message;
    this.code = retMsg.return.code;
    this.data = new Object();
}

 module.exports = { 
     returnData: returnData,
     returnDataEmpty: returnDataEmpty,
     returnDataMessage: returnDataMessage
}   