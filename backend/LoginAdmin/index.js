
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
    let obj = JSON.parse(event.body);
    let givenEmail = "'" + obj.email + "'";
   try {
       
    let foundAdminEntry = await new Promise((resolve, reject) => {

      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select * from Admins Where email = ' + givenEmail, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    if (foundAdminEntry.length === 0) {
        return{
            statusCode: 400,
            body: "error: No admin with email " + givenEmail + " exists"
            
        }
    }else{
        //There is a designer with the given email, so we need to build the return body
        foundAdminEntry = foundAdminEntry[0]
    }
    
    
    return {
      statusCode: 200,
      body:foundAdminEntry
   
    }


  } catch (err) {
    return {
      statusCode: 400,
      body: err.message
    }
  }
};

