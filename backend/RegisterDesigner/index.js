
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
    let givenName = "'" + obj.name + "'";
   try {
       
    let matchingDesigners = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select email from Designers where email = ' + givenEmail, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    if(matchingDesigners.length !== 0){
      return{
        statusCode: 400,
        body: "error: Email " + givenEmail + " already exists in the table Designers"
      }
    }
    
     let matchingSupporters = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select email from Supporters where email = ' + givenEmail, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    if(matchingSupporters.length !== 0){
      return{
        statusCode: 400,
        body: "error: Email " + givenEmail + " already exists in the table Supporters"
      }
    }
    
    let matchingAdmins = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Select email from Admins where email = ' + givenEmail, function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    if(matchingAdmins.length !== 0){
      return{
        statusCode: 400,
        body: "error: Email " + givenEmail + " already exists in the table Admins"
      }
    }
    
    
    
    
    let insertResult = await new Promise((resolve, reject) => {
      connection.getConnection(function (err,connection) {
        if (err) {
          reject(err);
        }
        connection.query('Insert into Designers (email,name) VALUES (' + givenEmail + ',' + givenName + ')', function (err, result) {
            connection.release()
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      })
    });
    
    let designer = {
      email : obj.email,
      name : obj.name
    }
    
    
    return{
      statusCode: 200,
      body: designer
    }
    
  
  
  

  } catch (err) {
    return {
      statusCode: 400,
      body: err.message
    }
  }
};
