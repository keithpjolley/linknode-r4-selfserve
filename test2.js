var mysql     = require('mysql');
var path      = require('path');
var dbconf  = require(path.join('/Users/kjolley/Dropbox/prj/site/node/linknode', 'private', 'mysql', 'dbconf'));
var ls_rw   = dbconf.local.linksprite_rw;
var connection = mysql.createConnection(ls_rw)
connection.connect(function(err) {
  if(err) { console.log('{"error":500, "reason":"db error"}'); }
});
var query = {"sql":"UPDATE devicestate SET (params = ?) WHERE deviceid = ? LIMIT 1","values":["{\"blank\":\"inside\"}","00800001eb"]}

connection.query(query.sql, query.values, function(error, results, fields) {
  if(error) {           console.log('{"error":500, "reason":"db error"}'); }
  if(!results.length) { console.log('{"error":400, "reason":"db error"}'); }
  console.log("doquery: results: " + results);
});
connection.end();


