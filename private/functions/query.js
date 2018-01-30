var mysql     = require('mysql');
var path      = require('path');

function doquery(query) {
  const dbconf  = require(path.join(__dirname, '..', 'mysql', 'dbconf'));
  const ls_rw   = dbconf.local.linksprite_rw;
  var connection = mysql.createConnection(ls_rw)

  return new Promise((resolve, reject) => {
    connection.connect(function(err) {
      if(err) { reject({"error":500, "reason":"db error 1"}); }
    })
    connection.query(query.sql, query.values, function(error, results, fields) {
      if(error) { reject({"error":500, "reason":"db error 2"}); }
      else if(results.length > 0) { resolve(results); }
      else { resolve([query.values[0]]); }
    });
    connection.end();
  });
}

module.exports = doquery;
