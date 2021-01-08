'use strict';
const returnData = require('../Models/returnData');
const talkDeskAPi = require('../Models/TalkdeskAPI');

exports.teste = function(req, res) {
    console.log('teste');
    res.json({ message: 'Mensagem: GET ' +  req.params.msgTeste });
};


exports.aggregate = async (req, res) => {
  try {
    let phoneData = req.body;
    var sectors = await talkDeskAPi.getSectors(res, phoneData);
    if (sectors.isValid)
    {
      res.status(sectors.code);
      res.json(JSON.stringify(sectors.data));
    }
    else
      throw new returnData.returnDataMessage(false,'error',sectors.message);

  } catch (error) {
      res.status(error.status != undefined ? error.status : 400);
      res.json({ message: error.message });
  }
  
};


