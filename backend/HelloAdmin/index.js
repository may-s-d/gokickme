
var mysql = require('mysql')

var connection = mysql.createPool({
    "connectionLimit" : 10,
    "host" : "gokickmedb.ct9osjgvash0.us-east-2.rds.amazonaws.com",
    "user" : "DBAdmin",
    "password" : "DBAdminPW",
    "database" : "mydb",
    "port" : "3306"
});

exports.handler = async (event) => {
    
    //TODO make data a [] and use append, try to only use one await
   try {
    const data1 = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('show tables', function (err, result) {
            connection.release()
          if (err) {
            //console.log("Error->" + err);
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    const data2 = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('select * from Admins', function (err, result) {
            connection.release()
          if (err) {
            //console.log("Error->" + err);
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
   


    return {
      statusCode: 200,
      body: JSON.stringify(data1) + JSON.stringify(data2)
    }


  } catch (err) {
    return {
      statusCode: 400,
      body: err.message
    }
  }
};
