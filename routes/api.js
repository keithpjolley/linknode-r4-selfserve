
var express   = require('express');
var router    = express.Router();
var multer    = require('multer');
var upload    = multer();
var path      = require('path');

const doquery  = require(path.join(__dirname, '..', 'private', 'functions', 'query'));

function checkinput(body) {
  const actionlist = new Set(["update", "query"])
  return new Promise((resolve, reject) => {  
    const deviceidLength = 10;
    if(  (typeof body.deviceid === 'undefined')
       ||(typeof body.action   === 'undefined')
       ||(body.deviceid.length != deviceidLength)
       ||(!actionlist.has(body.action))) {
      reject({"error":400, "reason":"Invalid Request"});
    }
    var params = {'not': 'used'};
    if(typeof body.params === 'undefined') {
      if(body.action === 'update') {
        reject({"error":400, "reason":"Invalid Request"});
      }
    } else {
      params = body.params;
    }
    resolve({"deviceid": body.deviceid, "action": body.action, "params": params});
  });
};

function querytype(request) {
  var sql;
  switch(request.action) {
    case 'update':
      sql = 'UPDATE devices SET params = ? WHERE deviceid = ? LIMIT 1';
      values = [JSON.stringify(request.params), request.deviceid];
      break;
    case 'query':
      sql = 'SELECT params AS returnMe FROM devices WHERE deviceid = ?'; 
      values = [request.deviceid];
      break;
    default:
      throw new Error({"error":400, "reason":"Invalid Request"});
  }
  return({"sql": sql, "values": values});
}

function parseresults(results) {
  // these first two I don't know what the heck I got passed, if anything.
  if(results    === undefined) {return({}); }
  if(results[0] === undefined) {return({}); }

  // this is the consolation prize (from inserts)
  if(results[0].returnMe === undefined) {return(JSON.parse(JSON.stringify(results[0])));}
  // this is the main prize (from queries)
  return(JSON.parse(results[0].returnMe));
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  return;
});

router.post('/', upload.array(), function(req, res, next) {
  res.set("Connection", "close"); 
  // this was some debug code
  //const FLAG_A = 1; // 0001
  //const FLAG_B = 2; // 0010
  //const FLAG_C = 4; // 0100
  //const FLAG_D = 8; // 1000
  //var d = Date.now();
  //var s = (d & FLAG_D) ? "0" : "1";
  //s+= (d & FLAG_C) ? "0" : "1";
  //s+= (d & FLAG_B) ? "0" : "1";
  //s+= (d & FLAG_A) ? "0" : "1";
  //console.log("relays: " + s);
  //return(res.json(JSON.parse(JSON.stringify({"relays": s}))));
  checkinput(req.body)
    .then(inputs  => {return(querytype(inputs)); })
    .then(query   => {return(doquery(query)); })
    .then(results => {return(parseresults(results)); })
    .then(parsed  => {return(res.json(parsed)); })
    .catch(error  => {
      if(error.error){return(res.status(error.error).json(error)); }
      else           {return(res.status(500).json({error:500, message: "something went wrong"})); };
    });
  return;
});

module.exports = router;
