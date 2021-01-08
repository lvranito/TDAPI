'use strict'
var https = require('https');
const config = require('../Config.json');
const validation = require('../Models/Validate');
const returndata = require('./returnData');
const reqHost = config.configuration.reqHost;
const sectorPath = config.configuration.hostSectorPath;

//#region Prefixes
// clears the Prefix array
exports.ClearPrefixes = function()
{
    PrefixSectors = {};
}

// Add a new prefix, with or whitout sector information
function AddPrefix(pref, sect = undefined, PfxSect)
{
    // check for prefix
    var p = PfxSect[pref];
    if (p === undefined) { 
        PfxSect[pref] = new Object();
        if(sect !=undefined) {
            PfxSect[pref][sect] = 1
        }
    }
    else{
        // check for sector
        let s = PfxSect[pref][sect];
        if(s === undefined)  {
            if (sect != undefined)
            {
                PfxSect[pref][sect] = 1
            }
        }
        else {
            PfxSect[pref][sect]++;
        }
    }
}
//#endregion 

//#region process request return data
function checkAPIReturn(ret) {
    if (ret === undefined) { 
        throw new returndata.returnData(false,'emptyAPIreturn');
    }
    else if(ret.code != undefined) {
        throw new returndata.returnDataMessage(false,'error',ret.message);
    }
    return true;
}
//#endregion

//#region get activity sector
const getSectorAsync = (phoneData) => new Promise(function (resolve, reject) {
    var options = {
        host: reqHost,
        path: '/'+ sectorPath +'/' + phoneData,
        method: 'GET',
    };
      
        console.log('before request to checking number ' + JSON.stringify(phoneData));
        // console.log('options ' + JSON.stringify(options));
        //return bussiness sector call
        var req = https.request(options, function (res) {
            //console.log("statusCode: ", res.statusCode);
            res.on('data', function (d) {
                //console.log('Call completed ' + JSON.stringify(d));
                resolve(JSON.parse(d));
            })
        });
        req.on('error', error => {
            reject(error);
        });
    
        req.end();
})

// Checks validation return for errors or empty numbers list
// and creates return object
function checkValidationReturn(valReturn) {
    var retData;
    
    if(valReturn.isValid)
    {
        if (valReturn.phoneNumbers.length == 0)
            retData = new returndata.returnData(false,'nophonenumbers');  
        else
            retData = new returndata.returnDataMessage(true,'success',valReturn.message);  
    }
    else
        retData = new returndata.returnDataMessage(false,'error',config.errors.find(element => element.state == 'invalidnumber'));  
    
    return retData;
}


exports.getSectors = async function(res, reqData) {
    /***** returnData object structure ********
        isValid: bool  -- validation state 
        message: string -- return message error / success
        code: int -- http return code
        data: object -- prefix code data
    ****************************************/
    var returnData;
    var PfxSect = new  Object();
    let numbers;
    let phoneData = reqData;

    //#region pre-validation
    console.log('before validation:' + new Date());
    let valData = validation.validateData(phoneData);
    returnData = checkValidationReturn(valData);

    if( !returnData.isValid ) {
      console.log(returnData.message);
      return returnData;
    }
    numbers = valData.phoneNumbers.filter(p => p.prefix != undefined);
    //#endregion
    console.log('after validation:' + new Date());
    for (let number of numbers) {
        let sector = await getSectorAsync(number.number); 
        if (checkAPIReturn(sector)){
            AddPrefix(number.prefix, sector.sector,PfxSect);
        }
        res.writeProcessing();
    }        
    returnData.data = PfxSect;
    return returnData;
}
//#endregion